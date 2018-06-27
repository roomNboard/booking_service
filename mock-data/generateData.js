/* eslint-disable */

const Chance = require('chance');

const chance = new Chance();

const LISTINGS_DEFAULT = 100 * 100000;
const OWNERS_DEFAULT = 100 * 100000;
const USERS_DEFAULT = 700 * 100000;
const MAX_REVIEWS_DEFAULT = 30;
const MIN_STAY_DEFAULT = 2;
const MAX_STAY_DEFAULT = 11;
const START_DATE = new Date();

// const dateYYYYMMDD = (date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
const addDays = (date, days) => new Date(date.getTime() + days * 86400000);

const generateInteger = (max = 1, min = 0) => Math.floor(Math.random() * ((max + 1) - min)) + min;

const createBooking = (listingId, startDate, duration) => (
  `${
    listingId
  },${
    generateInteger(USERS_DEFAULT, 1)
  },${
    startDate.getFullYear()
  },${
    startDate.getMonth() + 1
  },${
    startDate.getDate()
  },${
    duration
  }\n`
);

const addMockBookings = (listingId, startDate, dateRange) => {
  const array = [];
  const popularity = generateInteger(8, 2);;
  let available = true;
  let prevBookingDuration;
  let count = 0;
  let daysAway = 0;
  let reduced = 0;
  let day;
  while (daysAway < dateRange) {
    day = addDays(startDate, daysAway);
    count = available ? count : count += 1;
    if (!available && count === prevBookingDuration) {
      available = true;
      count = 0;
    }
    if (available && popularity >= generateInteger(10 + reduced, 1)) {
      available = false;
      prevBookingDuration = generateInteger(MAX_STAY_DEFAULT, MIN_STAY_DEFAULT);
      array.push(createBooking(listingId, day, prevBookingDuration));
    }
    daysAway += 1;
    reduced = Math.floor(daysAway * 0.25);
  }
  return array.join('');
};

const generateAllBookings =  (listingStart, listingEnd, callback) => {
  for (let i = listingStart; i <= listingEnd; i += 1) {
    addMockBookings(i, new Date(), 90, callback);
  }
};

const generateOneBooking = (listingId) => addMockBookings(listingId, START_DATE, 90);

const generateFirstName =  (listingStart, listingEnd, callback) => {
  const userRatio = USERS_DEFAULT / LISTINGS_DEFAULT;
  for (let i = (listingStart - 1) * userRatio + 1 ; i <= listingEnd * userRatio; i++) {
    if (callback)  callback(`${chance.first()}\n`);
  }
};

const generateOneFirstName = () => {
    return `${chance.first()}\n`;
}

const createReview = (listingID) => (
  `${
    generateInteger(5, 2)
  },${
    listingID
  }\n`
);

const generateAllReviews =  (listingStart, listingEnd, callback) => {
  for (let i = listingStart; i <= listingEnd; i++) {
    const numOfListingReviews = generateInteger(MAX_REVIEWS_DEFAULT, 1);
    for (let j = 0; j < numOfListingReviews; j++) {
      if (callback)  callback(createReview(i));
    }
  }
};

const generateOneListingReviews = (listingId) => {
  const array = [];
  for (let i = 0; i < generateInteger(MAX_REVIEWS_DEFAULT, 1); i++) {
    array.push(createReview(listingId));
  }
  return array.join('');
}

const costModifier = (min, max, guests) => generateInteger(
  Math.floor(min * (1 + (guests * 0.25))),
  Math.floor(max * (1 + (guests * 0.25)))
);

const generateAllListingInfo =  (listingStart, listingEnd, callback) => {
  for (let i = listingStart; i <= listingEnd; i++) {
    const owner = i;
    const listingName = chance.word();
    const maxGuests = generateInteger(10, 1);
    const price = costModifier(35, 150, maxGuests);
    const minStay = generateInteger(MAX_STAY_DEFAULT, MIN_STAY_DEFAULT);
    const cleaningFee = costModifier(5, 15, maxGuests);
    const areaTax = costModifier(5, 15, maxGuests);
    if (callback) callback(`${owner},${listingName},${maxGuests},${price},${minStay},${cleaningFee},${areaTax}\n`);
  }
};

const generateOneListingInfo = (listingId) => {
  const maxGuests = generateInteger(10, 1);
  return (
    `${
      chance.word()
    },${
      listingId
    },${
      maxGuests
    },${
      costModifier(35, 150, maxGuests)
    },${
      generateInteger(MAX_STAY_DEFAULT, MIN_STAY_DEFAULT)
    },${
      costModifier(5, 15, maxGuests)
    },${
      costModifier(5, 15, maxGuests)
    }\n`
  );
}

module.exports = {
  generateAllBookings,
  generateFirstName,
  generateAllReviews,
  generateAllListingInfo,
  generateOneBooking,
  generateOneFirstName,
  generateOneListingReviews,
  generateOneListingInfo,
};
