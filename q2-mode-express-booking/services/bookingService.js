const bookingRepository = require('../repositories/bookingRepository')
const { saveInCache, existsInCache, lockItem } = require('../util/cacheUtils')

async function bookChargingStation(userId, stationId, reservationDate) {

  const CACHE_KEY = `${stationId}-${reservationDate}`;

  // Checking if exists in cache
  await cacheSearch(CACHE_KEY);

  // Locking station and date until all db operations are complete
  const lock = await lockItem([`lock:${CACHE_KEY}`]);

  await dbSearch(stationId, reservationDate);
  await saveBooking(userId, stationId, reservationDate, CACHE_KEY);
  await lock.release();
    
}

async function cacheSearch(key) {
   if (await existsInCache(key) === 1) {
    console.log("Cache hit: " + await existsInCache(key));
    throw Error("Already booked (Cache hit)");
  }
}

async function dbSearch(stationId, reservationDate, CACHE_KEY) {
  if (await bookingRepository.findBooking(stationId, reservationDate) != null) {
      saveInCache(CACHE_KEY);
      console.log(`Error: Existing booking was not in cache, but in DB ${stationId}:${reservationDate}`)
      throw new Error('Reservation already exists');
    }
}


async function saveBooking(userId, stationId, reservationDate, CACHE_KEY) {
 try {
      await bookingRepository.saveBooking(userId, stationId, reservationDate);
      await saveInCache(CACHE_KEY)
    } catch (err) {
      console.log(err);
      throw new Error("Failed to register new reservation");
    }
}


//TODO: To be used in the case of a live demo
function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end);
}


module.exports = {
  bookChargingStation
}