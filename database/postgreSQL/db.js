const massive = require('massive');

const config = {
  host: process.env.pgHost,
  port: process.env.pgPort,
  database: process.env.pgDatabase,
  user: process.env.pgUser,
  password: process.env.pgPassword,
};

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
