const preDb = require('./db');
const path = require('path');

const test = async () => {
  const db = await preDb;
  console.time('query test');
  // const response1 = await db.query("SELECT * FROM listings INNER JOIN bookings ON bookings.listing_id = listings.listing_id INNER JOIN owners ON owners.owner_id = listings.owner_id INNER JOIN reviews ON reviews.listing_id = listings.listing_id WHERE listings.listing_id = 10000000;");
  const response1_1 = db.listings.find(10000000);
  const response1_2 = db.bookings.find({ listing_id: 10000000 }, {
    fields: ['user_id', 'duration'],
    exprs: {
      start_date: "CONCAT(start_year,'-',start_month,'-',start_date)",
    },
    only: true,
  });
  const response1_3 = db.reviews.find({ listing_id: 10000000 }, { fields: ['rating'] });
  const data1 = await response1_1;
  const data2 = await response1_2;
  const data3 = await response1_3;
  console.timeEnd('query test');
  console.log(data1);
  console.log(data2);
  console.log(data3);

  console.time('insertion test');
  const response2 = await db.bookings.insert({
    booking_id: 100000002,
    listing_id: 2,
    user_id: 1000,
    start_year: 2018,
    start_month: 2,
    start_date: 1,
    duration: 12,
  });
  console.timeEnd('insertion test');
  console.log(response2);

  console.time('find test');
  const response4 = await db.bookings.find({
    booking_id: 100000002,
  });
  console.timeEnd('find test');
  console.log(response4);

  console.time('deletion test');
  const response3 = await db.bookings.destroy({
    booking_id: 100000002,
  })
  console.timeEnd('deletion test');
  console.log(response3);

  const response5 = await db.bookings.find({
    booking_id: 100000002,
  });
  console.log(response5);
};

test().then(() => { process.exit(-1); });
