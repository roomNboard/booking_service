const massive = require('massive');
const config = require('./config');

let db;

const getDb = async () => {
  if (db) {
    return db;
  }
  db = await massive(config[process.env.NODE_ENV]);
  return db;
};

db = getDb();

module.exports = db;
