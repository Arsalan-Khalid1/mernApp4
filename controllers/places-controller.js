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