import path from 'path';
import dotenv from 'dotenv';
import { commandOptions } from 'redis';
import { publisher, subscriber } from './lib/redis';
import { downloadFromS3, uploadToS3 } from './lib/aws';
import { buildProject } from './lib/utils';
import { getAllFilePaths } from './lib/fileKeeper';

dotenv.config();

async function main() {
  if (!process.env.MAIN_QUEUE || !process.env.STATUS_QUEUE) {
    throw new Error('Missing env variables: MAIN_QUEUE, STATUS_QUEUE');
  }

  while (true) {
    const message = await subscriber.brPop(commandOptions({
      isolated: true,
    }), process.env.MAIN_QUEUE, 0);

    console.log('--> message: ', message);

    if (message) {
      const id = message.element;

      try {
        const source = `output/${id}`;
        const target = __dirname;
        const localBuildPath = path.join(target, source);
        const distPath = path.join(localBuildPath, 'dist')

        await downloadFromS3(source, target)
        await buildProject(localBuildPath);

        const filePaths = getAllFilePaths(distPath);

        filePaths.forEach(async (fullPath) => {
          const localFilePath = fullPath.slice(distPath.length + 1);
          const fileName = `dist/${id}/${localFilePath}`

          await uploadToS3(fileName, fullPath);
        });

      } catch (error) {
        console.error(error);
      } finally {
        publisher.hSet(process.env.STATUS_QUEUE, id, "deployed");
        console.log('--> done');
      }
    }
  }
}

main();