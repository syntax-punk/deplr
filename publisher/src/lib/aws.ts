import path from 'path';
import fs from 'fs';
import * as AWS from 'aws-sdk';
import { sleep } from './utils';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

let s3: any;

function getS3() {
  if (!s3) {
    s3 = new AWS.S3();
  }
  return s3;
}

export async function uploadToS3(fileName: string, fullPath: string) {
  const s3 = getS3();

  const fileContent = fs.readFileSync(fullPath);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileContent
  };

  await sleep(200);
  const result = await s3.upload(params).promise();
  
  return result;
}

export async function downloadFromS3(source: string, target: string) {
  const s3 = getS3();

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: source
  };

  await sleep(1000);

  const { Contents } = await s3.listObjectsV2(params).promise();

  const readPromises = Contents?.map(async ({ Key }: any) => {
    return new Promise(async (resolve) => {
      const fileOutputPath = path.join(target, Key);
      const outputFolder = path.dirname(fileOutputPath);
      const outputStream = fs.createWriteStream(fileOutputPath);

      if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
      }
  
      s3.getObject(
        { Bucket: process.env.AWS_BUCKET_NAME, Key: Key || "" }
      ).createReadStream()
        .pipe(outputStream)
        .on("finish", () => { resolve(true); });
    })
  }) || [];

  await Promise.all(readPromises.filter((p: any) => p !== undefined));
}