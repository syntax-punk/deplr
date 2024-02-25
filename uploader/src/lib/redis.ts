import { createClient } from 'redis';

const url = process.env.REDIS_HOST 
  ? `redis://${process.env.REDIS_HOST}:6379`
  : 'redis://localhost:6379'

const subscriber = createClient({
  url
});
subscriber.connect();

const publisher = createClient({
  url
});
publisher.connect();

export { subscriber, publisher }