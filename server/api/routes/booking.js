const express = require('express');
const db = require('../../../database/index');
const debug = require('debug')('app:*');

const router = express.Router();

router.post('/', (req, res, next) => {
  debug(`post request from booking component: listing ID ${req.body.listingID}`);
  res.status(201).json({
    message: 'post request with the following data recieved by server',
    data: req.body,
  });
});

router.get('/:id', (req, res, next) => {
  let { id } = req.params;
  id -= 1000 - 1;
  debug(`ID: ${id}`);

  db.queryAllDbTablesByRoomId(id, (error, results) => {
    if (error) {
      debug(error[0]);
    } else {
      debug(results);
      res.status(200).json({
        results,
      });
    }
  });
});

module.exports = router;
