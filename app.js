const express = require("express");
const placesRoutes = require("./routes/places-routes");
const HttpError = require("./models/http-errors");
const app = express();

app.use(express.json());

app.use('/api/places', placesRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this url', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if(res.headerSent) {
        return next(error);
    }
    else{
        res.status(error.code || 500);
        res.json({message: error.message || "An unknown error occured!"});
    }
});

app.listen(5000);
