import fs from 'fs';
import * as AWS from 'aws-sdk';

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

export async function uploadToS3(localPath: string, fullPath: string) {
  const s3 = getS3();

  const fileContent = fs.readFileSync(fullPath);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: localPath,
    Body: fileContent
  };

  const result = await s3.upload(params).promise();

  return result;
}