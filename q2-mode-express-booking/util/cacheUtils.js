const { redisClient, redlock } = require('../config/cache')

async function findInCache(key, reservationStart, reservationEnd) {

  const elements = await redisClient.zrange(key, 0, -1, "WITHSCORES");

  for (const item of elements) {
    const cache = JSON.parse(item)

    if (reservationStart < cache.reservationEnd && reservationEnd > cache.reservationStart) {
      console.log(`Blocked by ${cache.reservationStart}-${cache.reservationEnd} slot`);
      return true;
    }
  }

  return false;
}



async function saveInCache(key, reservationStart, reservationEnd) {
  await redisClient.zadd(
    key, new Date(reservationStart).getTime(),
    JSON.stringify({ reservationStart, reservationEnd }));
}

async function lockItem(key) {
  try {
    console.debug(`Locking: ${key}`);
    return await redlock.acquire([`lock:${key}`], 120000);
  } catch (err) {
    console.error(err);
    throw new Error("Reservation slot not available (redis lock - 2 minutes)");
  }

}


module.exports = {
  findInCache,
  saveInCache,
  lockItem
}