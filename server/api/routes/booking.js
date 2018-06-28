const express = require('express');
const db = require('../../../database/index');

const router = express.Router();

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: 'post request with the following data recieved by server',
    data: req.body,
  });
});

router.get('/:id', async (req, res, next) => {
  const listingId = parseInt(req.params.id, 10);

  const result = await db.queryAllDbTablesByListingId(listingId);
  res.status(200);
  res.send(result);
});

module.exports = router;
