const HttpError = require('../models/http-errors');
const {v4: uuid} = require("uuid");

let DUMMY_USERS = [
    {
        id: "u1",
        name: "Arsalan",
        email: "arslankhalid889@gmail.com",
        password: "test123"
    }
]

const getUsers = (req, res, next) => {
    res.status(200).json({users: DUMMY_USERS});
};

const signup = (req, res, next) => {
    const {name, email, password} = req.body;
    if(DUMMY_USERS.find(p => p.email === email)) {
        res.status(500).json({message: "User with the entered email already exist!"});
    }
    else{
        const createdUser = {
            name,
            email,
            password,
            id: uuid()
        };

        DUMMY_USERS.push(createdUser);
        res.status(201).json({user: createdUser});
    }
};

// const login = (req, res, next) => {};

exports.getUsers = getUsers;
exports.signup = signup;
// exports.login = login;