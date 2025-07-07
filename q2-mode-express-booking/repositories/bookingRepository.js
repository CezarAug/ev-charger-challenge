const db = require('../config/db')


async function findBooking(stationId, reservationDate) {
    return await db.oneOrNone('SELECT * FROM BOOKINGS WHERE BOOKING_DATE=$(reservationDate) AND STATION_ID=$(stationId)',{
        reservationDate,
        stationId
    });
}

async function saveBooking(userId, stationId, reservationDate) {
    await db.none(
        'INSERT INTO BOOKINGS (USER_ID, STATION_ID, BOOKING_DATE) VALUES($(userId), $(stationId), $(reservationDate))',
        { userId, stationId, reservationDate }
    );
}

module.exports = {
    findBooking,
    saveBooking
}