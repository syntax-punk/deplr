import { createClient } from 'redis';

const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

export { subscriber, publisher }