var express = require('express');
var router = express.Router();
const bookingService = require('../services/bookingService');

/* GET home page. (Default page from the generator, using it here as a liveness probe) */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




router.post('/reserve', async function(req, res) {

  try {
    
    await bookingService.bookChargingStation(req.body.userId, req.body.chargerId, req.body.reservation_start, req.body.reservation_end)
    
    // Return new reservation
    res.status(200).json("OK")
  
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
