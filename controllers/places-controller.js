const HttpError = require("../models/http-errors");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");

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
      "data:image/jpeg;base64,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",
    creator,
  });
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again!!",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "We could not find the user for provided Id",
      404
    );
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session: session });
    user.places.push(createdPlace);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError("creating place failed, please try again", 500);
    return next(error);
  }

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
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError("Something went wrong !!!", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find the place for this Id", 404);
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.remove({ session: session });
    place.creator.places.pull(place);
    await place.creator.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the place!!",
      500
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
