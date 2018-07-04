// using massiveJs as postgreSQL driver
const path = require('path');
const preDb = require('../database/postgreSQL/db');
const dbHelper = require('../database/index');
const request = require('supertest');
const app = require('../server/index');

describe('Server integration tests', () => {
  let db;

  beforeAll(async () => {
    db = await preDb;
  });

  describe('#GET /nonExisting', () => {
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
      });
    });

    test('should get error when no route found', async () => {
      const res = await request(app).get('/nonExisting');
      // console.log(res);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toEqual({});
    });
  });

  describe('#GET /booking', () => {
    test('should get error when no record found', async () => {
      const res = await request(app).get('/booking/2');
      // console.log(res);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toEqual({});
    });

    test('should get listing and booking information', async () => {
      const res = await request(app).get('/booking/1');
      // console.log(res);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
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
      expect(res.body).toEqual(expected);
    });
  });

  describe('#POST /booking', () => {
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
      });
    });

    test('should get error when no record found', async () => {
      const res = await request(app).post('/booking/2').send({
        user_id: 1,
        start_date: '2018-2-1',
        duration: 8,
      });
      // console.log(res);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toEqual({});
    });

    test('should get error when booking gets conflict', async () => {
      const res = await request(app).post('/booking/1').send({
        user_id: 1,
        start_date: '2018-2-23',
        duration: 8,
      });
      // console.log(res);
      expect(res.statusCode).toEqual(403);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toEqual({});
    });

    test('should get 201 when post request get through', async () => {
      const res = await request(app).post('/booking/1').send({
        user_id: 2,
        start_date: '2018-3-12',
        duration: 8,
      });
      // console.log(res);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toEqual({});
      const expected = [
        {
          user_id: '1',
          start_date: '2018-3-2',
          duration: 10,
        },
        {
          user_id: '2',
          start_date: '2018-3-12',
          duration: 8,
        },
      ];
      expect(await db.bookings.find({ listing_id: 1 }, {
        fields: ['user_id', 'start_date', 'duration'],
        only: true,
      })).toEqual(expected);
    });
  });
});
