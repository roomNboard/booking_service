const express = require('express');
const db = require('../../../database/index');
const debug = require('debug')('app:*');

const roomIdAdjustment = 0;

const router = express.Router();

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: 'post request with the following data recieved by server',
    data: req.body,
  });
});

router.get('/:id', (req, res, next) => {
  let id = parseInt(req.params.id, 10);
  id += roomIdAdjustment;

  db.queryAllDbTablesByRoomId(id, (error, results) => {
    if (error) {
      debug(error[0]);
    } else {
      res.status(200).json({
        results,
      });
    }
  });
});

module.exports = router;
