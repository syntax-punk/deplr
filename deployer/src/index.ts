import express from 'express';
import cors from 'cors';
import git from 'simple-git';
import path from 'path';
import { generateRandomId } from './lib/utils';
import { getAllFilePaths } from './lib/fileKeeper';
import dotenv from 'dotenv';
import { uploadToS3 } from './lib/aws';
import { publisher } from './lib/redis';

const PORT = 1337;

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/deploy', async (req, res) => {
  const url = req.body.repoUrl;
  const id = generateRandomId();
  const projPath = path.join(__dirname, 'output', id);
  await git().clone(url, projPath);

  const paths = getAllFilePaths(projPath);
  paths.forEach(async (path) => {
    const localPath = path.slice(__dirname.length + 1);
    await uploadToS3(localPath, path);
  });

  publisher.lPush("build-q", id);

  return res.json({
    id
  })
});

app.listen(PORT, () => {
  console.log('-> Deployer listening on: ', PORT);
});