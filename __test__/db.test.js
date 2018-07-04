// using massiveJs as postgreSQL driver
const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, '../env/test.env') });
const preDb = require('../database/postgreSQL/db');
const dbHelper = require('../database/index');
const util = require('util');

// const requestAsync = util.promisify(request);

describe('Persistent Booking Server', () => {
  let db;

  beforeAll(async () => {
    db = await preDb;
  });

  beforeEach(async () => {
    await db.withTransaction(async (tx) => {
      await tx.query('ALTER TABLE reviews DROP CONSTRAINT fk_reviews_listing_id;');
      await tx.query('ALTER TABLE bookings DROP CONSTRAINT fk_bookings_listing_id;');
      await tx.query('ALTER TABLE reviews DROP CONSTRAINT pk_reviews;');
      await tx.query('ALTER TABLE listings DROP CONSTRAINT pk_listings;');
      await tx.query('ALTER TABLE bookings DROP CONSTRAINT pk_bookings;');
      await Promise.all([tx.query('TRUNCATE TABLE bookings;'), tx.query('TRUNCATE TABLE listings;'), tx.query('TRUNCATE TABLE reviews;')]);
      await Promise.all([
        tx.listings.insert({
          listing_id: 1,
          listing_name: 'hello',
          owner_id: 1,
          max_guests: 5,
          price: 256,
          min_stay: 3,
          cleaning_fee: 4,
          area_tax: 3,
        }),
        tx.bookings.insert({
          booking_id: 1,
          listing_id: 1,
          user_id: 1,
          start_date: '2018-3-2',
          duration: 10,
        }),
        tx.reviews.insert({
          listing_id: 1,
          total_rating: 3,
          review_count: 120,
        }),
      ]);
      await tx.query('ALTER TABLE bookings ADD CONSTRAINT pk_bookings PRIMARY KEY (booking_id);');
      await tx.query('ALTER TABLE listings ADD CONSTRAINT pk_listings PRIMARY KEY (listing_id);');
      await tx.query('ALTER TABLE reviews ADD CONSTRAINT pk_reviews PRIMARY KEY (listing_id);');
      await tx.query('ALTER TABLE bookings ADD CONSTRAINT fk_bookings_listing_id FOREIGN KEY (listing_id) REFERENCES listings (listing_id);');
      await tx.query('ALTER TABLE reviews ADD CONSTRAINT fk_reviews_listing_id FOREIGN KEY (listing_id) REFERENCES listings (listing_id);');
      await tx.query("SELECT setval('bookings_booking_id_seq', (SELECT MAX(booking_id) FROM bookings)+1);");
    });
  });

  test('Should query bookings info from the DB', async () => {
    expect(dbHelper.queryAllDbTablesByListingId).toBeInstanceOf(Function);
    let response = dbHelper.queryAllDbTablesByListingId(1);
    expect(response).toBeInstanceOf(Promise);
    response = await response;
    const expected = {
      listing:
        {
          listing_id: '1',
          listing_name: 'hello',
          owner_id: '1',
          max_guests: 5,
          price: '256.000000',
          min_stay: 3,
          cleaning_fee: '4.000000',
          area_tax: '3.000000',
          total_rating: '3.000000',
          review_count: 120,
        },
      bookings: [
        {
          user_id: '1',
          duration: 10,
          start_date: '2018-3-2',
        },
      ],
    };
    expect(response).toEqual(expected);
  });

  test('Should insert new bookings info into the DB', async () => {
    expect(dbHelper.insertBookingInfo).toBeInstanceOf(Function);
    const newBooking = {
      booking_id: 2,
      listing_id: 1,
      user_id: 1,
      start_date: '2019-3-6',
      duration: 8,
    };
    const action = dbHelper.insertBookingInfo(newBooking);
    expect(action).toBeInstanceOf(Promise);
    await action;
    const response = await dbHelper.queryAllDbTablesByListingId(1);
    const expected = {
      listing:
        {
          listing_id: '1',
          listing_name: 'hello',
          owner_id: '1',
          max_guests: 5,
          price: '256.000000',
          min_stay: 3,
          cleaning_fee: '4.000000',
          area_tax: '3.000000',
          total_rating: '3.000000',
          review_count: 120,
        },
      bookings: [
        {
          user_id: '1',
          duration: 10,
          start_date: '2018-3-2',
        },
        {
          user_id: '1',
          duration: 8,
          start_date: '2019-3-6',
        },
      ],
    };
    expect(response).toEqual(expected);
  });

  test('Should delete bookings info from the DB', async () => {
    expect(dbHelper.deleteBookingInfo).toBeInstanceOf(Function);
    const action = dbHelper.deleteBookingInfo(1);
    expect(action).toBeInstanceOf(Promise);
    await action;
    const response = await dbHelper.queryAllDbTablesByListingId(1);
    const expected = {
      listing:
        {
          listing_id: '1',
          listing_name: 'hello',
          owner_id: '1',
          max_guests: 5,
          price: '256.000000',
          min_stay: 3,
          cleaning_fee: '4.000000',
          area_tax: '3.000000',
          total_rating: '3.000000',
          review_count: 120,
        },
      bookings: [],
    };
    expect(response).toEqual(expected);
  });

  test('Should update bookings info in the DB', async () => {
    expect(dbHelper.updateBookingInfo).toBeInstanceOf(Function);
    const newBooking = {
      start_date: '2019-3-6',
      duration: 7,
    };
    const action = dbHelper.updateBookingInfo(1, newBooking);
    expect(action).toBeInstanceOf(Promise);
    await action;
    const response = await dbHelper.queryAllDbTablesByListingId(1);
    const expected = {
      listing:
        {
          listing_id: '1',
          listing_name: 'hello',
          owner_id: '1',
          max_guests: 5,
          price: '256.000000',
          min_stay: 3,
          cleaning_fee: '4.000000',
          area_tax: '3.000000',
          total_rating: '3.000000',
          review_count: 120,
        },
      bookings: [
        {
          user_id: '1',
          duration: 7,
          start_date: '2019-3-6',
        },
      ],
    };
    expect(response).toEqual(expected);
  });
});
