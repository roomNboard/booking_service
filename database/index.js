const preDb = require('./postgreSQL/db');


const queryAllDbTablesByListingId = async (listingId) => {
  const db = await preDb;

  const bookings = db.bookings.find({ listing_id: listingId }, {
    fields: ['user_id', 'duration'],
    exprs: {
      start_date: "CONCAT(start_year,'-',start_month,'-',start_date)",
    },
    only: true,
  });
  const listingReview = db.query('SELECT * FROM listings INNER JOIN reviews ON listings.listing_id = reviews.listing_id WHERE listings.listing_id = $1;', [listingId]);

  return ({
    listing: (await listingReview)[0],
    bookings: await bookings,
  });
};

const insertBookingInfo = async (booking) => {
  const db = await preDb;

  return db.bookings.insert(booking);
};

module.exports = {
  queryAllDbTablesByListingId,
  insertBookingInfo,
};

// queryAllDbTablesByListingId(10000000).then((result) => { console.log(result); process.exit(-1); });
