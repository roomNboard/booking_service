const preDb = require('./postgreSQL/db');


const queryAllDbTablesByListingId = async (listingId) => {
  const db = await preDb;

  const bookings = db.bookings.find({ listing_id: listingId }, {
    fields: ['user_id', 'start_date', 'duration'],
    only: true,
  });
  const listingReview = db.query('SELECT * FROM listings INNER JOIN reviews ON listings.listing_id = reviews.listing_id WHERE listings.listing_id = $1;', [listingId]);

  return ({
    listing: (await listingReview)[0],
    bookings: await bookings,
  });
};

// const queryBookingInfoByListingId = async (listingId) => {
//   const db = await preDb;

//   return db.bookings.find({ listing_id: listingId }, {
//     fields: ['user_id', 'start_date', 'duration'],
//     only: true,
//   });
// };

const insertBookingInfo = async (booking) => {
  const db = await preDb;

  return db.bookings.insert(booking);
};

const deleteBookingInfo = async (bookingId) => {
  const db = await preDb;

  return db.bookings.destroy(bookingId);
};

const updateBookingInfo = async (bookingId, updatedBookingInfo) => {
  const db = await preDb;

  return db.bookings.update(bookingId, updatedBookingInfo);
};

module.exports = {
  queryAllDbTablesByListingId,
  // queryBookingInfoByListingId,
  insertBookingInfo,
  deleteBookingInfo,
  updateBookingInfo,
};

// queryAllDbTablesByListingId(10000000).then((result) => { console.log(result); process.exit(-1); });
