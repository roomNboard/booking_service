# Booking-Service

> Booking service for SDC

## Related Projects

  - https://github.com/n-app/titleGallery
  - https://github.com/n-app/reviews
  - https://github.com/n-app/filter-listings-ryan
  - https://github.com/n-app/N-appbnb-description-listing

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage
### Add database and tables to mysql:
* In the terminal:
> run `mysql.server start` if not already started.
> run `mysql -u root < ./database/schema.sql`
> you may need to run `mysql -u username -p < ./database/schema.sql` if a username or password has been set for your account.

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development
### Add mock data to database
* In mysql:
> To use database:
> run `use booking_service`
* In Terminal:
> To insert mock data into database:
> run `node insertData.js` in the mock-data directory
### Run webpack and server
* In Terminal:
> `npm run dev` - runs webpack -d --watch
> `npm run start-dev` - runs nodemon server/index.js
> `npm run start` - runs node server/index.js

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```
