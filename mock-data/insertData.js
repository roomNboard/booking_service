const db = require('../database/index');
const mock = require('./generateData');
const debug = require('debug')('app:*');

const userAccounts = mock.generateFirstName(755).map((user) => {
  const arr = [];
  arr.push(user);
  return arr;
});
const ownerAccounts = mock.generateFirstName(100).map((owner) => {
  const arr = [];
  arr.push(owner);
  return arr;
});
const listingInfo = mock.generateAllListingInfo(100);
const allBookings = mock.generateAllBookings(100, 755);
const listingReviews = mock.generateAllReviews(100, 755);

db.insertIntoDB('INSERT INTO users (userName) VALUES ? ', userAccounts, (error, results) => {
  if (error) {
    debug(`Error log debugger: ${error}`);
  } else {
    debug(`Success: ${results.message}, changedRows: ${results.changedRows}`);
  }
});

db.insertIntoDB('INSERT INTO owners (ownerName) VALUES ? ', ownerAccounts, (error, results) => {
  if (error) {
    debug(`Error log debugger: ${error}`);
  } else {
    debug(`Success: ${results.message}, changedRows: ${results.changedRows}`);
  }
});

db.insertIntoDB('INSERT INTO listings (owner_id, maxGuests, price, minStay, cleaningFee, areaTax) VALUES ?', listingInfo, (error, results) => {
  if (error) {
    debug(`Error log debugger: ${error}`);
  } else {
    debug(`Success: ${results.message}, changedRows: ${results.changedRows}`);
  }
});

db.insertIntoDB('INSERT INTO bookings (listing_id, user_id, startDate, endDate) VALUES ?', allBookings, (error, results) => {
  if (error) {
    debug(`Error log debugger: ${error}`);
  } else {
    debug(`Success: ${results.message}, changedRows: ${results.changedRows}`);
  }
});

db.insertIntoDB('INSERT INTO reviews (rating, listing_id) VALUES ?', listingReviews, (error, results) => {
  if (error) {
    debug(`Error log debugger: ${error}`);
  } else {
    debug(`Success: ${results.message}, changedRows: ${results.changedRows}`);
  }
});
