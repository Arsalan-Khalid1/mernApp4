// const HttpError = require('../models/http-errors');
// const {v4: uuid} = require("uuid");
// const {validationResult} = require('express-validator');

// let DUMMY_USERS = [
//     {
//         id: "u1",
//         name: "Arsalan",
//         email: "arslankhalid889@gmail.com",
//         password: "test123"
//     }
// ]

// const getUsers = (req, res, next) => {
//     res.status(200).json({users: DUMMY_USERS});
// };

// const signup = (req, res, next) => {
//     const errors = validationResult(req);
//     if(!errors.isEmpty())
//     {
//         console.log(errors);
//         throw new HttpError("Invalid inputs passed, plaese check your data.", 422);
//     };
//     const {name, email, password} = req.body;
//     if(DUMMY_USERS.find(p => p.email === email)) {
//         res.status(500).json({message: "User with the entered email already exist!"});
//     }
//     else{
//         const createdUser = {
//             name,
//             email,
//             password,
//             id: uuid()
//         };

//         DUMMY_USERS.push(createdUser);
//         res.status(201).json({user: createdUser});
//     }
// };

// const login = (req, res, next) => {
//     const {email, password} = req.body;
//     const identifiedUser = DUMMY_USERS.find(u => u.email === email);
//     if(!identifiedUser || identifiedUser.password !== password){
//         throw new HttpError("Could not identify the user, credentials maybe wrong!");
//     }
//     res.status(200).json({message:"logged in!"});
// };

// exports.getUsers = getUsers;
// exports.signup = signup;
// exports.login = login;
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-errors");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Max Schwarz",
    email: "test@test.com",
    password: "testers",
  },
];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: "https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
