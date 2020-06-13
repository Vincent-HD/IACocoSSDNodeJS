'use strict';

const express = require('express');
const router = express.Router();
const image = require('../controllers/imageController');

router.get('/', async (req, res, next) => {
  res.render('index', {
    data: await image.getLast20Results()
  });
});

router.post('/', (req, res, next) => {
  image.insertResult(req);
  res.sendStatus(200);
});

module.exports = router;
