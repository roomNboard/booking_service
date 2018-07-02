const preDb = require('./db');

const test = async () => {
  const listingId = 10000000;
  const db = await preDb;
  console.time('query test');
  const response1_1 = db.query('SELECT * FROM listings INNER JOIN reviews ON listings.listing_id = reviews.listing_id WHERE listings.listing_id = $1;', [listingId]);
  const response1_2 = db.reviews.find(listingId, { fields: ['total_rating', 'review_count'] });
  const data1 = await response1_1;
  const data2 = await response1_2;
  console.timeEnd('query test');
  console.log(data1);
  console.log(data2);

  console.time('insertion test');
  const response2 = await db.bookings.insert({
    booking_id: 100000002,
    listing_id: 2,
    user_id: 1000,
    start_date: '2019-2-1',
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
  });
  console.timeEnd('deletion test');
  console.log(response3);

  const response5 = await db.bookings.find({
    booking_id: 100000002,
  });
  console.log(response5);
};

test().then(() => { process.exit(-1); });
