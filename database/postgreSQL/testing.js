const preDb = require('./db');
const path = require('path');

const test = async () => {
  const db = await preDb;
  console.time('query test');
  const response = await db.query("SELECT * FROM listings INNER JOIN bookings ON bookings.listing_id = listings.listing_id INNER JOIN owners ON owners.owner_id = listings.owner_id INNER JOIN reviews ON reviews.listing_id = listings.listing_id INNER JOIN users ON bookings.user_id = users.user_id WHERE listings.listing_id = 522922;");
  console.timeEnd('query test');
  return response;
};

test().then((response) => { console.log(response); process.exit(-1); });
