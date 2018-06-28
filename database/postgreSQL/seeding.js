const db = require('./index');
const path = require('path');

// table listings
// let columns = [
//   'listing_name',
//   'owner_id',
//   'max_guests',
//   'price',
//   'min_stay',
//   'cleaning_fee',
//   'area_tax',
// ];

// table bookings
// let columns = [
//   'listing_id',
//   'user_id',
//   'start_year',
//   'start_month',
//   'start_date',
//   'duration',
// ];

// table reviews
let columns = [
  'total_rating',
  'review_count',
];


// table bookings
// const createTable =
//   `CREATE TABLE bookings
//   (
//   booking_id bigserial NOT NULL,
//   listing_id bigint NOT NULL,
//   user_id bigint NOT NULL,
//   start_year smallint NOT NULL,
//   start_month smallint NOT NULL,
//   start_date smallint NOT NULL,
//   duration smallint NOT NULL
//   );
//   ALTER TABLE bookings ADD CONSTRAINT pk_bookings
//   PRIMARY KEY (booking_id);`;

// table listings;
// const createTable =
//   `CREATE TABLE listings
//   (
//   listing_id bigserial NOT NULL,
//   listing_name varchar(50) NOT NULL,
//   owner_id bigint NOT NULL,
//   max_guests smallint DEFAULT 6,
//   price numeric(11,6) NOT NULL,
//   min_stay smallint DEFAULT 1,
//   cleaning_fee numeric(11,6) DEFAULT 0,
//   area_tax numeric(11,6) NOT NULL
//   );
  
//   ALTER TABLE listings ADD CONSTRAINT pk_listings
//   PRIMARY KEY (listing_id);`;

// table reviews
const createTable =
  `CREATE TABLE reviews
  (
  listing_id bigserial NOT NULL,
  total_rating numeric(11,6) NOT NULL,
  review_count integer NOT NULL
  );
  
  ALTER TABLE reviews ADD CONSTRAINT pk_reviews
  PRIMARY KEY (listing_id);`;


const tableName = 'reviews';
const csvFolderPath = path.resolve(__dirname, '../../csv/');
// const testingFilePath = path.resolve(csvFolderPath, 'testing.csv');
const fileName = 'listingReviews';
const numberFiles = 10;
// const filePaths = [testingFilePath, testingFilePath];
const filePaths = Array(numberFiles).fill().map((_, i) => path.resolve(csvFolderPath, `${fileName}_${i}.csv`));
// console.log(filePaths);
const sqls = [createTable];
filePaths.forEach((filePath) => {
  sqls.push(`COPY ${tableName} (${columns.join(',')}) FROM '${filePath}' WITH DELIMITER ','`);
});

db.query(sqls).then(() => { process.exit(-1); });
// const sqls = ["select * from users where user_name = 'Jimmy'"];
// db.query(sqls).then((data) => { console.log(data[0][data[0].length - 1]); console.log(data[0].length); }).then(() => { process.exit(-1); });
