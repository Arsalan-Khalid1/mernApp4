const HttpError = require('../models/http-errors');

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

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;