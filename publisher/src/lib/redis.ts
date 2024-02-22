import { createClient } from 'redis';

const subscriber = createClient();
subscriber.connect();

export { subscriber }