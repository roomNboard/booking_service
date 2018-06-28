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
  const review = db.reviews.find(listingId, { fields: ['total_rating', 'review_count'] });
  const listing = db.listings.find(listingId);

  return ({
    review: await review,
    listing: await listing,
    bookings: await bookings,
  });
};

module.exports = {
  queryAllDbTablesByListingId,
};

// queryAllDbTablesByListingId(10000000).then((result) => { console.log(result); process.exit(-1); });
