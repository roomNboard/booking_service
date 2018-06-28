const db = require('./db');

const bookingSchema = new db.Schema({
  user_id: Number,
  start_year: Number,
  start_month: Number,
  start_date: Number,
  duration: Number,
}, { toJSON: { virtuals: true } });

bookingSchema.virtual('user', {
  ref: 'user',
  localField: 'user_id',
  foreignField: 'user_id',
  justOne: false,
});

const ownerSchema = new db.Schema({
  owner_name: String,
});

const reviewSchema = new db.Schema({
  rating: Number,
});

const listingSchema = db.Schema({
  listing_id: Number,
  listing_name: String,
  owner_id: Number,
  max_guests: Number,
  price: Number,
  min_stay: Number,
  bookings: [bookingSchema],
  owner: { ownerSchema },
  reviews: [reviewSchema],
}, { collection: 'bookings' });

const userSchema = db.Schema({
  user_id: Number,
  user_name: String,
}, { collection: 'users' });

const Booking = db.model('booking', listingSchema);

// const BookingList = db.model('bookingList', bookingSchema);

const User = db.model('user', userSchema);

const loadBookingInfoById = listingId => Booking.findOne({ listing_id: listingId }).exec();

const loadUserInfoById = userId => User.findOne({ user_id: userId }).exec();

const loadBookingInfoWithUserById = listingId => (
  Booking
    .find({ listing_id: listingId })
    .populate({
      path: 'bookings.user',
    })
    .exec()
);

const insertBookingInfo = (bookingDoc, newBooking) => {
  bookingDoc.bookings.push(newBooking);
  return bookingDoc.save();
}

const deleteBookingInfo = (bookingDoc, userId) => {
  bookingDoc.bookings.id(bookingDoc.bookings.find(value => value.user_id === userId)['_id']).remove();
  return bookingDoc.save();
};

const loadBookingInfoByName = listingName => Booking.findOne({ listing_name: listingName }).exec();

const loadUserInfoByName = userName => Booking.find({ user_name: userName }).exec();

const testQueryById = async (listingId) => {
  // console.time('query booking');
  // const data1 = await loadBookingInfoById(listingId);
  // console.timeEnd('query booking');
  // console.log(data1);

  // console.time('insert booking');
  // const data4 = await insertBookingInfo(data1, {
  //   user_id: 100000000,
  //   start_year: 2018,
  //   start_month: 12,
  //   start_date: 12,
  //   duration: 5,
  // });
  // console.timeEnd('insert booking');
  // console.log(data4);

  // console.time('delete booking');
  // const data5 = await deleteBookingInfo(data4, 100000000);
  // console.timeEnd('delete booking');
  // console.log(data5);

  // console.time('query user');
  // const data2 = await loadUserInfoById(data1.bookings[0].user_id);
  // console.timeEnd('query user');
  // console.log(data2);

  console.time('query booking with user');
  const data3 = await loadBookingInfoWithUserById(listingId);
  console.timeEnd('query booking with user');
  console.log(JSON.stringify(data3));
  process.exit(-1);
};

const testQueryBookingByName = async (listingName) => {
  console.time('query booking with name');
  const data1 = await loadBookingInfoByName(listingName);
  console.timeEnd('query booking with name');
  console.log(data1);
};

const testQueryUserByName = async (userName) => {
  console.time('query user with name');
  const data1 = await loadUserInfoByName(userName);
  console.timeEnd('query user with name');
  console.log(data1);
}


const testing = async () => {
  // await testQueryBookingByName('omwuvzes');
  // await testQueryUserByName('Olse');
  await testQueryById(9999998);
};

testing().then(() => { process.exit(-1); });
