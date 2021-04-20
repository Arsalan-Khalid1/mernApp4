const HttpError = require("../models/http-errors");
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, couldn't find place by given ID",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find the place for the provided property",
      404
    );

    return next(error);
  }
  return res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed please try again!!",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find the places for the provided property", 404)
    );
  }

  return res.json({ places });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs passed, plaese check your data.", 422));
  }
  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://scontent.flhe3-1.fna.fbcdn.net/v/t1.6435-9/120270313_1678786832325970_8139761353787146575_n.jpg?_nc_cat=100&ccb=1-3&_nc_sid=09cbfe&_nc_eui2=AeHEI2hQwNjMu7DCMryNTd5Nd7Ukq5Rsj1J3tSSrlGyPUgVk7mbR9JkS54Hf2O-J8pZTj-S1GraBz6K4IT-v7_XV&_nc_ohc=w7Q5thxGfXgAX-SXNOa&_nc_ht=scontent.flhe3-1.fna&oh=9b0a74ebd7ab8996d5e035e89ed6125b&oe=60A07FE2",
    creator,
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("creating place failed, please try again", 500);
    return next(error);
  }

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, plaese check your data.", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, couldn't find place by given ID",
      500
    );
    return next(error);
  }
  if (!place) {
    const error = new HttpError(
      "Could not find the place for the provided property",
      404
    );

    return next(error);
  }
  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while updating the db, please try agian!!"
    );
    return next(error);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Something went wrong !!!");
    return next(error);
  }
  try {
    await place.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the place!!"
    );
    return next(error);
  }

  res.status(200).json({ message: "place deleted successfully" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
