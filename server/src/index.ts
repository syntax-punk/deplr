import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getContentForExtension } from './lib/utils';
import { getObjectFromS3 } from './lib/aws';

const PORT = 8080;

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/ping', (_, res) => {
  res.send('server: pong');
});

app.get('/*', async (req, res) => {
  const host = req.hostname;
  const id = host.split('.')[0];
  let filePath = req.path;
  if (filePath === '/') 
    filePath += 'index.html';

  const extension = filePath.split('.').pop() || 'html';
  const content = await getObjectFromS3(id, filePath);
  
  res.setHeader('Content-Type', getContentForExtension(extension));
  res.send(content.Body);
});

app.listen(PORT, () => {
  console.log('-> Request Server listening on: ', PORT);
});