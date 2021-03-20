const { json } = require('body-parser');
const express = require('express');
const placeController = require('../controllers/places-controller');
const router = express.Router();

router.get('/:pid', placeController.getPlaceById);

router.get('/users/:uid', placeController.getPlaceByUserId);

module.exports = router;