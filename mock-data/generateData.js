const Chance = require('chance');
const Moment = require('moment');
const MomentRange = require('moment-range');

const chance = new Chance();
const moment = MomentRange.extendMoment(Moment);

const LISTINGS_DEFAULT = 100;
const OWNERS_DEFAULT = 100;
const USERS_DEFAULT = 755;
const MAX_REVIEWS_DEFAULT = 350;
const MIN_STAY_DEFAULT = 2;
const MAX_STAY_DEFAULT = 11;

const createBooking = (startDate, duration, listingID, users) => {
  const start = startDate.format('YYYY-MM-DD');
  const end = startDate.clone().add(duration, 'days').format('YYYY-MM-DD');
  const userID = chance.integer({ min: 1, max: users });
  return [listingID, userID, start, end];
};

const addMockBookings = (listingID, momentRange, users) => {
  const mockBookings = [];
  const popularity = chance.integer({ min: 2, max: 8 });
  let available = true;
  let prevBookingDuration;
  let count = 0;
  let daysAway = 0;
  let reduced = 0;
  for (const day of momentRange.by('day')) {
    count = available ? count : count += 1;
    if (!available && count === prevBookingDuration) {
      available = true;
      count = 0;
    }
    if (available && popularity >= chance.integer({ min: 1, max: 10 + reduced })) {
      available = false;
      prevBookingDuration = chance.integer({ min: MIN_STAY_DEFAULT, max: MAX_STAY_DEFAULT });
      mockBookings.push(createBooking(day, prevBookingDuration, listingID, users));
    }
    daysAway += 1;
    reduced = Math.floor(daysAway * 0.25);
  }
  return mockBookings;
};

const generateAllBookings = (listings = LISTINGS_DEFAULT, users = USERS_DEFAULT) => {
  const today = moment().format('YYYY-MM-DD');
  const periodEnd = moment(today).clone().add(2, 'years').format('YYYY-MM-DD');
  const bookingRange = moment.range(today, periodEnd);
  const allListingBookings = [];

  for (let i = 1; i <= listings; i += 1) {
    const listingID = i;
    allListingBookings.push(addMockBookings(listingID, bookingRange, users));
  }

  return allListingBookings.reduce((a, b) => a.concat(b), []);
};

const generateFirstName = (users = OWNERS_DEFAULT) => {
  const accounts = [];
  for (let i = 1; i <= users; i += 1) {
    const user = chance.first();
    let double = "";
    user.split('').forEach((char) => {
      double += char;
    });
    accounts.push(double);
  }
  return accounts;
};

const createReview = (listingID) => {
  const review = [];
  const rating = chance.integer({ min: 0, max: 5 });
  review.push(rating);
  review.push(listingID);
  return review;
};

const generateAllReviews = (listings = LISTINGS_DEFAULT, maxReviews = MAX_REVIEWS_DEFAULT) => {
  const allListingReviews = [];
  for (let i = 1; i <= listings; i += 1) {
    const numOfListingReviews = chance.integer({ min: 1, max: maxReviews });
    console.log(numOfListingReviews);
    const currentListingID = i;
    for (let j = 0; j < numOfListingReviews; j += 1) {
      allListingReviews.push(createReview(currentListingID));
    }
  }
  return allListingReviews;
};

const costModifier = (min, max, guests) => {
  const minModifier = Math.floor(min * (1 + (guests * 0.25)));
  const maxModifier = Math.floor(max * (1 + (guests * 0.25)));
  return chance.integer({ min: minModifier, max: maxModifier });
};

const generateAllListingInfo = (listings = LISTINGS_DEFAULT) => {
  const allListingInfo = [];
  for (let i = 1; i <= listings; i += 1) {
    const owner = i;
    const maxGuests = chance.integer({ min: 1, max: 10 });
    const price = costModifier(35, 150, maxGuests);
    const minStay = chance.integer({ min: MIN_STAY_DEFAULT, max: MAX_STAY_DEFAULT });
    const cleaningFee = costModifier(5, 15, maxGuests);
    const areaTax = costModifier(5, 15, maxGuests);
    allListingInfo.push([owner, maxGuests, price, minStay, cleaningFee, areaTax]);
  }
  return allListingInfo;
};

module.exports = {
  generateAllBookings,
  generateFirstName,
  generateAllReviews,
  generateAllListingInfo,
};
