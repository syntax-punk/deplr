import { createClient } from 'redis';

const publisher = createClient();
publisher.connect();

export { publisher }