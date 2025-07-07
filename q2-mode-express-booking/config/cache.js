const Redis = require("ioredis");
const { default: Redlock } = require("redlock");

const redisClient = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT) || 6379,
  });

redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('error', (err) => console.error('Redis error:', err));


const redlock = new Redlock(
  [redisClient], {
    retryCount: 3,
    retryDelay: 100,
  }
);
module.exports = {
    redisClient,
    redlock
}