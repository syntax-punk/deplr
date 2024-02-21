import express from 'express';
import cors from 'cors';
import git from 'simple-git';
import path from 'path';
import { generateRandomId } from './utils';
import { getAllFiles } from './fileKeeper';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/deploy', async (req, res) => {
  const url = req.body.repoUrl;
  const id = generateRandomId();
  const projPath = path.join(__dirname, 'tmp', id);
  await git().clone(url, projPath);

  const files = getAllFiles(projPath);

  return res.json({
    id
  })
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});