const path = require('path');
const fs = require('fs');
// const stream = require('stream');

const importCSVFolderPath = '/Volumes/David Data/csv_backup/csv_v1/';
// const csvFolerPath = path.resolve(__dirname, '../csv');
const tableNames = ['owners', 'reviews', 'bookings', 'listings', 'users'];
const fileNames = ['ownerAccounts', 'listingReviews', 'allBookings', 'listingInfo', 'userAccounts'];
const filePaths = {};
fileNames.forEach((fileName, index) => {
  filePaths[tableNames[index]] = i => path.resolve(importCSVFolderPath, `${fileName}_${i}.csv`);
});

const countStart = {
  listings: i => (i * 1000000) + 1,
  bookings: i => ({
    0: 1,
    1: 1 + 9367849,
    2: 1 + 9367849 + 9363703,
    3: 1 + 9367749 + 9363703 + 9366081,
    4: 1 + 9367749 + 9363703 + 9366081 + 9366261,
    5: 1 + 9367749 + 9363703 + 9366081 + 9366261 + 9364425,
    6: 1 + 9367749 + 9363703 + 9366081 + 9366261 + 9364425 + 9368132,
    7: 1 + 9367749 + 9363703 + 9366081 + 9366261 + 9364425 + 9368132 + 9361732,
    8: 1 + 9367749 + 9363703 + 9366081 + 9366261 + 9364425 + 9368132 + 9361732 + 9363913,
    9: 1 + 9367749 + 9363703 + 9366081 + 9366261 + 9364425 + 9368132 + 9361732 + 9363913 + 9361525,
  }[i]),
  reviews: i => ({
    0: 1,
    1: 1 + 6543815,
    2: 1 + 6543815 + 6549359,
    3: 1 + 6543815 + 6549359 + 6544777,
    4: 1 + 6543815 + 6549359 + 6544777 + 6550873,
    5: 1 + 6543815 + 6549359 + 6544777 + 6550873 + 6552220,
    6: 1 + 6543815 + 6549359 + 6544777 + 6550873 + 6552220 + 6551440,
    7: 1 + 6543815 + 6549359 + 6544777 + 6550873 + 6552220 + 6551440 + 6549522,
    8: 1 + 6543815 + 6549359 + 6544777 + 6550873 + 6552220 + 6551440 + 6549522 + 6544878,
    9: 1 + 6543815 + 6549359 + 6544777 + 6550873 + 6552220 + 6551440 + 6549522 + 6544878 + 6547579,
  }[i]),
  owners: i => (i * 1000000) + 1,
  users: i => (i * 7000000) + 1,
};

const columns = {
  listings: [
    'listing_name',
    'owner_id',
    'max_guests',
    'price',
    'min_stay',
    'cleaning_fee',
    'area_tax',
  ],
  bookings: [
    'listing_id',
    'user_id',
    'start_year',
    'start_month',
    'start_date',
    'duration',
  ],
  owners: [
    'owner_name',
  ],
  reviews: [
    'rating',
    'listing_id',
  ],
  users: [
    'user_name',
  ]
};

const idNames = {
  listings: 'listing_id',
  bookings: 'booking_id',
  owners: 'owner_id',
  reviews: 'review_id',
  users: 'user_id',
}



/* eslint-disable no-restricted-syntax */
async function* chunksToLines(chunksAsync) {
  let previous = '';
  for await (const chunk of chunksAsync) {
    previous += chunk;
    let eolIndex;
    while ((eolIndex = previous.indexOf('\n')) >= 0) {
      const line = previous.slice(0, eolIndex);
      yield line;
      previous = previous.slice(eolIndex+1);
    }
  }
  if (previous.length > 0) {
    yield previous;
  }
}

async function* lineToObj(linesAsync, tableName, countOn) {
  if (countOn) {
    let count = countOn;
    for await (const line of linesAsync) {
      const lineArray = line.split(',');
      const lineObj = { [idNames[tableName]]: count };
      columns[tableName].forEach((column, index) => {
        lineObj[column] = isNaN(lineArray[index]) ? lineArray[index] : parseInt(lineArray[index], 10);
      });
      yield lineObj;
      count += 1;
    }
  } else {
    for await (const line of linesAsync) {
      const lineArray = line.split(',');
      const lineObj = {};
      columns[tableName].forEach((column, index) => {
        lineObj[column] = lineArray[index];
      });
      yield lineObj;
    }
  }
}

async function* groupObjByListingId(objAsync, idName, countOn, deleteKeys = []) {
  let current = [];
  let id = countOn;
  for await (const obj of objAsync) {
    if (current.length) {
      if (obj[idName] === id) {
        deleteKeys.forEach(key => delete obj[key]);
        current.push(obj);
      } else {
        yield current;
        id += 1;
        while (id !== obj[idName]) {
          id += 1;
          yield [];
        }
        deleteKeys.forEach(key => delete obj[key]);
        current = [obj];
      }
    } else {
      deleteKeys.forEach(key => delete obj[key]);
      current.push(obj);
    }
  }
  if (current.length) {
    yield current;
    current = [];
  }
}

async function* convertCSVtoJSON(i, countOn) {
  const gen = yield;
  const listingStream = fs.createReadStream(filePaths.listings(i));
  const bookingStream = fs.createReadStream(filePaths.bookings(i));
  const reviewStream = fs.createReadStream(filePaths.reviews(i));
  const ownerStream = fs.createReadStream(filePaths.owners(i));
  const writeStream = fs.createWriteStream(path.resolve(importCSVFolderPath, `output_${i}.json`));
  const listingIterator = lineToObj(chunksToLines(listingStream), 'listings', countOn);
  const bookingIterator = groupObjByListingId(lineToObj(chunksToLines(bookingStream), 'bookings', countStart.bookings(i)), idNames.listings, countOn, [idNames.listings, idNames.bookings]);
  const ownerIterator = groupObjByListingId(lineToObj(chunksToLines(ownerStream), 'owners', countStart.owners(i)), idNames.owners, countOn, [idNames.owners]);
  const reviewIterator = groupObjByListingId(lineToObj(chunksToLines(reviewStream), 'reviews', countStart.reviews(i)), idNames.listings, countOn, [idNames.listings, idNames.reviews]);
  let writingIndicator = true;
  let done = false;
  let curId;
  let listing;
  try {
    while (true) {
      if (writingIndicator) {
        const listingProduct = await listingIterator.next();
        const booking = bookingIterator.next();
        const owner = ownerIterator.next();
        const review = reviewIterator.next();
        listing = listingProduct.value;
        // terminating condition:
        done = listingProduct.done;
        if (done) { writeStream.end(); return; }
        listing.bookings = (await booking).value;
        [listing.owner] = (await owner).value;
        listing.reviews = (await review).value;
        curId = listing.listing_id;
        writingIndicator = writeStream.write(`${JSON.stringify(listing)}\n`);
      } else {
        writeStream.once('drain', () => { gen.next(true); });
        writingIndicator = yield;
      }
    }
  } catch (err) {
    console.log('err count:', curId);
    console.log('current Listing', listing);
    console.log('err:', err);
  }
}

/* eslint-enable no-restricted-syntax */

const convertBookingTable = async () => {
  if (fs.existsSync(importCSVFolderPath)) {
    for (let i = 0; i < 10; i++) {
      const iterator = convertCSVtoJSON(i, countStart.listings(i));
      iterator.next();
      await iterator.next(iterator);
    }
  }
}

// convertBookingTable();

async function* convertCSVtoJSON2(i, countOn) {
  const gen = yield;
  const userStream = fs.createReadStream(filePaths.users(i));
  const writeStream = fs.createWriteStream(path.resolve(importCSVFolderPath, `users_${i}.json`));
  const userIterator = lineToObj(chunksToLines(userStream), 'users', countOn);
  let writingIndicator = true;
  let done = false;
  let curId;
  let user;
  try {
    while (true) {
      if (writingIndicator) {
        const userProduct = await userIterator.next();
        user = userProduct.value;
        done = userProduct.done;
        // terminating condition:
        if (done) { writeStream.end(); return; }
        curId = user.user_id;
        writingIndicator = writeStream.write(`${JSON.stringify(user)}\n`);
      } else {
        writeStream.once('drain', () => { gen.next(true); });
        writingIndicator = yield;
      }
    }
  } catch (err) {
    console.log('err count:', curId);
    console.log('current user', user);
    console.log('err:', err);
  }
}

const convertUserTable = async () => {
  if (fs.existsSync(importCSVFolderPath)) {
    for (let i = 0; i < 10; i++) {
      const iterator = convertCSVtoJSON2(i, countStart.users(i));
      iterator.next();
      await iterator.next(iterator);
    }
  }
};

convertUserTable();


// might be useful for refactoring:
/*
function createPromiseWorkflow(generatorFunction) {
  const iterator = generatorFunction.apply(this, arguments);

  function iterationProxy() {
    function pipeResultBackIntoGenerator(iteratorResult) {
      if (iteratorResult.done) {
        return (Promise.resolve(iteratorResult.value));
      }
      const intermediaryPromise = Promise
        .resolve(iteratorResult.value)
        .then(
          value => (pipeResultBackIntoGenerator(iterator.next(value))),
          reason => (pipeResultBackIntoGenerator(iterator.throw(reason))),
        );
      return (intermediaryPromise);
    }

    try {
      return (pipeResultBackIntoGenerator(iterator.next()));
    } catch (error) {
      return (Promise.reject(error));
    }
  }

  return (iterationProxy);
}

function* getAllData (asyncIterables) {
  const result = yield Promise.all(asyncIterables);

}
*/

/*
async function printAsyncIterable(asyncIterable, asyncIterable2) {
  for await (const obj of asyncIterable) {
    console.log('obj', obj);
    console.log((await asyncIterable2.next()).value);

  }
}

async function pushToObj(asyncIterable) {
  const obj = [];
  for await (const iterable of asyncIterable) {
    obj.push(iterable);
  }
}

class CsvToObj extends stream.Transform {
  constructor(fileName) {
    super();
    this.fileName = fileName;
    this.soFar = '';
  }

  async _transform(chunk) {
    for await (const obj of lineToObj(chunksToLines(chunk), this.fileName)) {
      this.push(`${JSON.stringify(obj)}\n`);
    }
  }
}

const test = () => {
  const listingStream = fs.createReadStream(filePaths['Listings']);
  const ownerStream = fs.createReadStream(filePaths['Owners']);
  printAsyncIterable(lineToObj(chunksToLines(listingStream), 'Listings'), groupObjByListingId(lineToObj(chunksToLines(ownerStream), 'Owners'), 'owner_id'));
};
*/
