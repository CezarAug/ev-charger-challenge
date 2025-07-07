var express = require('express');
var router = express.Router();
const bookingService = require('../services/bookingService');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




router.post('/reserve', async function(req, res) {

  // Validate

  // Cache service

  // Booking service
  try {
    
    await bookingService.bookChargingStation(req.body.userId, req.body.chargerId, req.body.date)
    
    // Return new reservation
    res.status(200).json("OK")
  
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
