const mysql = require('mysql');
const debug = require('debug')('app:*');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'booking_service',
});

connection.connect((error) => {
  if (error) {
    debug(`Error connecting to db, error code: ${error.code}`);
    return;
  }
  debug('connected to database...');
});

const insertIntoDB = (sql, values, callback) => {
  const bulkArr = [];
  bulkArr.push(values);
  connection.query(sql, bulkArr, (error, results, fields) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
};

const queryListingInfoByRoomId = (id, name = 'listing', callback) => {
  connection.query('SELECT * FROM listings WHERE id = ?', id, (err, rows) => {
    if (err) {
      callback(err, null, name);
    } else {
      debug(rows[0]);
      callback(null, rows, name);
    }
  });
};

const queryOwnerInfoByRoomId = (id, name = 'owner', callback) => {
  connection.query('SELECT * FROM owners WHERE id = ?', id, (err, rows) => {
    if (err) {
      callback(err, null, name);
    } else {
      debug(rows[0]);
      callback(null, rows, name);
    }
  });
};

const queryListingReviewsByRoomId = (id, name = 'reviews', callback) => {
  connection.query('SELECT COUNT(*) as totalReviews, SUM(rating) as starSum FROM reviews WHERE listing_id = ?', id, (err, rows) => {
    if (err) {
      callback(err, null, name);
    } else {
      debug(rows[0]);
      callback(null, rows, name);
    }
  });
};

const queryBookingsByRoomId = (id, name = 'bookings', callback) => {
  connection.query('SELECT * FROM bookings WHERE listing_id = ?', id, (err, rows) => {
    if (err) {
      callback(err, null, name);
    } else {
      debug(rows[0]);
      callback(null, rows, name);
    }
  });
};

const queryAllDbTablesByRoomId = (id, callback) => {
  const READ_DB_OPERATIONS = 4;
  const roomRecords = {};
  const errorLog = [];
  const idWrap = [];
  let queriesComplete = 0;
  idWrap.push(id);

  const trackQueryHelper = (error, data, name) => {
    queriesComplete += 1;
    if (error) {
      debug(`error reading from database, step: ${queriesComplete}, error: ${error}`);
      errorLog.push({ name, error });
    } else {
      roomRecords[name] = data;
    }

    if (queriesComplete === READ_DB_OPERATIONS) {
      if (errorLog.length === READ_DB_OPERATIONS) {
        callback(errorLog, null);
      } else {
        roomRecords.errors = errorLog;
        callback(null, roomRecords);
      }
    }
  };

  queryListingInfoByRoomId(idWrap, 'listing', trackQueryHelper);
  queryOwnerInfoByRoomId(idWrap, 'owner', trackQueryHelper);
  queryListingReviewsByRoomId(idWrap, 'reviews', trackQueryHelper);
  queryBookingsByRoomId(idWrap, 'bookings', trackQueryHelper);
};

module.exports = {
  connection,
  insertIntoDB,
  queryAllDbTablesByRoomId,
};
