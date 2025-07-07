const {redisClient, redlock} = require('../config/cache')

async function existsInCache(key) {
    console.log(`Cache lookup: ${key}`);
    return await redisClient.exists(key);
}

async function saveInCache(key) {
    console.log(`Caching: ${key}`)
    await redisClient.set(key, '');
}

async function lockItem(key) {
    try {
        console.log(`Locking: ${key}`);
        return await redlock.acquire([`lock:${key}`], 120000);
    } catch(err) {
        console.log(err);
        throw new Error("Reservation slot not available (redis lock - 2 minutes)"); 
    }
    
}


module.exports = {
    existsInCache,
    saveInCache,
    lockItem
}