DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS owners;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS users;


CREATE TABLE bookings
(
booking_id bigserial NOT NULL,
listing_id bigint NOT NULL,
user_id bigint NOT NULL,
start_date varchar(10) NOT NULL,
duration smallint NOT NULL
);

ALTER TABLE bookings ADD CONSTRAINT pk_bookings
PRIMARY KEY (booking_id);

CREATE TABLE listings
(
listing_id bigserial NOT NULL,
listing_name varchar(50) NOT NULL,
owner_id bigint NOT NULL,
max_guests smallint DEFAULT 6,
price numeric(11,6) NOT NULL,
min_stay smallint DEFAULT 1,
cleaning_fee numeric(11,6) DEFAULT 0,
area_tax numeric(11,6) NOT NULL
);

ALTER TABLE listings ADD CONSTRAINT pk_listings
PRIMARY KEY (listing_id);

CREATE TABLE reviews
(
listing_id bigserial NOT NULL,
total_rating numeric(11,6) NOT NULL,
review_count integer NOT NULL
);

ALTER TABLE reviews ADD CONSTRAINT pk_reviews
PRIMARY KEY (listing_id);

ALTER TABLE bookings ADD CONSTRAINT fk_bookings_listing_id
FOREIGN KEY (listing_id) REFERENCES listings (listing_id);

ALTER TABLE reviews ADD CONSTRAINT fk_reviews_listing_id
FOREIGN KEY (listing_id) REFERENCES listings (listing_id);



--TERMINAL CMD:
--psql booking_service -U [userName] -f [sqlFilePath]