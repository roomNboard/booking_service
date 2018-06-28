const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/booking_service');

mongoose.Promise = global.Promise;

const db = mongoose;
db.connection.once('open', (err) => {
  if (err) console.log('Connection error:', err);
  console.log('Mongoose Connection is up');
});

module.exports = db;
