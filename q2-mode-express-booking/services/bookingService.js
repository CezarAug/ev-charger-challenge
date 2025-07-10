const bookingRepository = require('../repositories/bookingRepository')
const { saveInCache, findInCache, lockItem } = require('../util/cacheUtils')

async function bookChargingStation(userId, stationId, reservationStart, reservationEnd) {

  //TODO: Update lock and cache keys
  const CACHE_KEY = `${stationId}`;
  const LOCK_KEY = `${stationId}-${reservationStart}-${reservationEnd}`;

  // Checking if exists in cache
  await cacheSearch(CACHE_KEY, reservationStart, reservationEnd);

  // Locking station and date until all db operations are complete
  const lock = await lockItem([`lock:${LOCK_KEY}`]);

  try {

    await dbSearch(stationId, reservationStart, reservationEnd, CACHE_KEY);
    await saveBooking(userId, stationId, reservationStart, reservationEnd, CACHE_KEY);

  } finally {
    // Releasing lock once operation is complete (Successfully or not)
    await lock.release();
  }
}

async function cacheSearch(key, reservationStart, reservationEnd) {
  if (await findInCache(key, reservationStart, reservationEnd)) {
    throw Error("Already booked (Cache hit)");
  }
}

async function dbSearch(stationId, reservationStart, reservationEnd, CACHE_KEY) {
  if (await bookingRepository.findBooking(stationId, reservationStart, reservationEnd) == false) {
    saveInCache(CACHE_KEY, reservationStart, reservationEnd);
    console.log(`Error: Existing booking was not in cache, but in DB ${stationId}:${reservationStart}`)
    throw new Error('Reservation already exists (Conflicting reservation found in DB)');
  }
}


async function saveBooking(userId, stationId, reservationStart, reservationEnd, CACHE_KEY) {
  try {
    await bookingRepository.saveBooking(userId, stationId, reservationStart, reservationEnd);
    await saveInCache(CACHE_KEY, reservationStart, reservationEnd);
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