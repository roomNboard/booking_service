// const db = require('../database/index');
const mock = require('./generateData');
const fs = require('fs');
const path = require('path');

const numberSegment = 10;
const numberRecord = (100 * 100000) / numberSegment;

const filePath = fileName => path.resolve(__dirname, '../csv/', `${fileName}.csv`);

console.log(`inserting booking info for ${numberRecord * numberSegment} listings`);

const writeFiles = [
  ['userAccounts', mock.generateOneFirstName],
  ['ownerAccounts', mock.generateOneFirstName],
  ['allBookings', mock.generateOneBooking],
  ['listingReviews', mock.generateOneListingReviews],
  ['listingInfo', mock.generateOneListingInfo],
];

function* writeFile(fp, func, i) {
  const writeStream = fs.createWriteStream(fp);
  const self = yield;
  let writingIndicator = true;
  let j = (i * numberRecord) + 1;
  while (j <= (i + 1) * numberRecord) {
    if (writingIndicator) {
      writingIndicator = writeStream.write(func(j));
      j += 1;
    } else {
      writeStream.once('drain', () => { self.next(true); });
      writingIndicator = yield;
    }
  }
}

const fileFlow = (fileName, func) => {
  for (let i = 0; i < numberSegment; i++) {
    const fp = filePath(`${fileName}_${i}`);
    const iterator = writeFile(fp, func, i);
    iterator.next();
    iterator.next(iterator);
  }
};

fileFlow(...writeFiles[4]);
