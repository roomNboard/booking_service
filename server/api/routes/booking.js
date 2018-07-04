const express = require('express');
const db = require('../../../database/index');
const redisClient = require('../../../database/redis/index');

const router = express.Router();

const addDays = (date, days) => new Date(date.getTime() + (days * 86400000));

const validateBooking = (bookings, newBooking) => {
  const newStartDate = new Date(`${newBooking.start_date}z`);
  return bookings.every((booking) => {
    const bookingStartDate = new Date(`${booking.start_date}z`);
    if (bookingStartDate < newStartDate) {
      return (addDays(bookingStartDate, booking.duration - 1) < newStartDate);
    }
    if (bookingStartDate > newStartDate) {
      return (addDays(newStartDate, newBooking.duration - 1) < bookingStartDate);
    }
    return false;
  });
};

router.post('/:id', async (req, res, next) => {
  try {
    const listingId = req.params.id;
    const booking = {
      listing_id: parseInt(listingId, 10),
      user_id: req.body.user_id,
      start_date: req.body.start_date,
      duration: req.body.duration,
    };
    if ((await redisClient.clientGet.hexists(listingId, 'listingId')) === 1) {
      let bookings = redisClient.clientGet.hget(listingId, 'bookings');
      bookings = JSON.parse(await bookings);
      if (validateBooking(bookings, booking)) {
        await db.insertBookingInfo(booking);
        res.sendStatus(201);
        redisClient.clientGet.hdel(listingId, 'listing', 'bookings');
      } else {
        res.sendStatus(403);
      }
    } else {
      const result = await db.queryAllDbTablesByListingId(listingId);
      if (!result.listing) {
        const err = new Error('listingId not found');
        err.status = 404;
        throw err;
      }
      const { bookings } = result;
      if (validateBooking(bookings, booking)) {
        await db.insertBookingInfo(booking);
        res.sendStatus(201);
      } else {
        res.sendStatus(403);
      }
    }
  } catch (err) {
    next(err);
  }
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
