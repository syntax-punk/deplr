## deplr

To run deplr you need couople of things fixed:
 - Get an aws account and and generate an access key and secret key that has access to the s3 bucket
 - deployer, uploader and server are using accessing s3 bucket so make sure you provide env vars via `.env` file for each of the services
 - fill in the `.env` file with the following
   - `AWS_ACCESS_KEY_ID=your_access_key`
   - `AWS_SECRET_ACCESS_KEY=your_secret_key`
   - `AWS_REGION=your_region`
   - `AWS_BUCKET_NAME=your_bucket_name`
   - `MAIN_QUEUE=you_progress_queue_name`
   - `STATUS_QUEUE=you_status_queue_name`
 - deplr is using redis as a message queue so make sure you have a redis server running on your machine or in docker container, deplr will try to connect to `localhost:6379` by default
 - if you have no redis running on your system or somewhere you can run it via docker by running:
   - `docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest`


