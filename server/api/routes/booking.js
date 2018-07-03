const express = require('express');
const db = require('../../../database/index');
const redisClient = require('../../../database/redis/index');

const router = express.Router();

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: 'post request with the following data recieved by server',
    data: req.body,
  });
});

router.get('/:id', async (req, res, next) => {
  let result;
  try {
    const listingId = req.params.id;
    if ((await redisClient.clientGet.hexists(listingId, 'listing')) === 1) {
      result = await redisClient.clientGet.hmget(listingId, 'listing', 'bookings');
      result = {
        listing: JSON.parse(result[0]),
        bookings: JSON.parse(result[1]),
      };
      res.status(200);
      res.json(result);
    } else {
      result = await db.queryAllDbTablesByListingId(parseInt(listingId, 10));
      if (!result.listing) {
        const err = new Error();
        err.status = 404;
        throw err;
      }
      result.bookings.forEach((booking) => {
        booking.start_date = `${booking.start_date.getFullYear()}-${booking.start_date.getMonth() + 1}-${booking.start_date.getDate()}`;
      });
      res.status(200);
      res.json(result);
      redisClient.clientGet.hmset(listingId, {
        listing: JSON.stringify(result.listing),
        bookings: JSON.stringify(result.bookings),
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
