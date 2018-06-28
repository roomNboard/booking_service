const preDb = require('./db');

const test = async () => {
  const db = await preDb;
  console.time('query test');
  const response1_1 = db.listings.find(9999999);
  const response1_2 = db.bookings.find({ listing_id: 9999999 }, {
    fields: ['user_id', 'duration'],
    exprs: {
      start_date: "CONCAT(start_year,'-',start_month,'-',start_date)",
    },
    only: true,
  });
  const response1_3 = db.reviews.find(9999999, { fields: ['total_rating', 'review_count'] });
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
