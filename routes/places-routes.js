const express = require('express');
const placeController = require('../controllers/places-controller');
const router = express.Router();

router.get('/:pid', placeController.getPlaceById);

router.get('/users/:uid', placeController.getPlacesByUserId);

router.post('/', placeController.createPlace);

router.patch('/:pid', placeController.updatePlace);

router.delete('/:pid', placeController.deletePlace);

module.exports = router;