const db = require('../config/db')

async function findBooking(stationId, reservationStart, reservationEnd) {
    return await db.one(
        `SELECT EXISTS (
            SELECT 1
            FROM BOOKINGS
            WHERE STATION_ID = $(stationId) 
            AND DURATION && tsrange($(reservationStart), $(reservationEnd), '[)')
        );`,
        { stationId, reservationStart, reservationEnd });
}

async function saveBooking(userId, stationId, reservationStart, reservationEnd) {
    await db.none(
        `INSERT INTO BOOKINGS (USER_ID, STATION_ID, DURATION) 
        VALUES($(userId), $(stationId), tsrange($(reservationStart), $(reservationEnd), '[)'))`,
        { userId, stationId, reservationStart, reservationEnd }
    );
}

module.exports = {
    findBooking,
    saveBooking
}