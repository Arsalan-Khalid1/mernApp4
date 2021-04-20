const express = require("express");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const mongoose = require("mongoose");
const HttpError = require("./models/http-errors");
const app = express();

const port = 5000;

app.use(express.json());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Accesss-Control-Allow-Headers",
//     "Origin, X-Requested-With, Cotent-Type, Accept, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
//   next();
// });
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,DELETE,POST,PATCH");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this url", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  } else {
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occured!" });
  }
});

mongoose
  .connect(
    "mongodb+srv://DDM:myplacebookdb@cluster0.vewb8.mongodb.net/mern?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`app is listeing at pot ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
