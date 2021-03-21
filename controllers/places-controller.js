const HttpError = require('../models/http-errors');
const {v4: uuid} = require("uuid");

const DUMMY_PLACES = [
    {
        id: 'p1' ,
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!!!',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
];

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });

    if(!place) {
        throw new HttpError("Could not find the place for the provided property", 404);
    }

    console.log('GET Request in Places');
    return res.json({place});
};

const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const place = DUMMY_PLACES.find(u => {
        return u.creator === userId;
    });
    if(!place) {
        return next(new HttpError("Could not find the place for the provided property", 404));
    }
    return res.json({place});
};

const createPlace = (req, res, next) => {

    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    }

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({place: createdPlace});

};

const updatePlace = (req, res, next) => {};

const deletePlace = (req, res, next) => {};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;