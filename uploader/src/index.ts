import express from 'express';
import cors from 'cors';
import git from 'simple-git';
import path from 'path';
import { generateRandomId } from './lib/utils';
import { getAllFilePaths } from './lib/fileKeeper';
import dotenv from 'dotenv';
import { uploadToS3 } from './lib/aws';
import { subscriber, publisher } from './lib/redis';

const PORT = 1337;

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/ping', (_, res) => {
  res.send('uploader: pong');
});

app.get('/:id/status', async (req, res) => {
  if (!process.env.MAIN_QUEUE || !process.env.STATUS_QUEUE) {
    return res.status(500).send('Missing env variables: MAIN_QUEUE, STATUS_QUEUE');
  }

  const id = req.params.id;
  if (!id) {
    return res.status(400).send('Missing id');
  }
  
  const status = await subscriber.hGet(process.env.STATUS_QUEUE, id as string);
  
  console.log('--> id: ', id);
  console.log('--> status: ', status);

  res.json({
    status
  })
});

app.get('/apps', async (req, res) => {
  if (!process.env.STATUS_QUEUE) {
    return res.status(500).send('Missing env variable: STATUS_QUEUE');
  }

  const apps = await subscriber.hGetAll(process.env.STATUS_QUEUE);

  res.json({
    apps
  });
});

app.post('/upload', async (req, res) => {

  if (!process.env.MAIN_QUEUE || !process.env.STATUS_QUEUE) {
    return res.status(500).send('Missing env variables: MAIN_QUEUE, STATUS_QUEUE');
  }

  const url = req.body.repoUrl;
  const id = generateRandomId();
  const projPath = path.join(__dirname, 'output', id);
  await git().clone(url, projPath);

  const paths = getAllFilePaths(projPath);
  paths.forEach(async (path) => {
    const localPath = path.slice(__dirname.length + 1);
    await uploadToS3(localPath, path);
  });

  publisher.lPush(process.env.MAIN_QUEUE, id);
  publisher.hSet(process.env.STATUS_QUEUE, id, "uploaded");

  return res.json({
    id
  })
});

app.listen(PORT, () => {
  console.log('-> Uploader listening on: ', PORT);
});