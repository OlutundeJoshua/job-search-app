const express = require('express');
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const ErrorObject = require('./utils/error');
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes')

const app = express();

//body parser
app.use(express.json())

//logger setup
let accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
    flags: "a",
  });
  app.use(morgan("combined", { stream: accessLogStream }));

//Routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/profiles', profileRoutes)
app.all("*", (req, res, next) => {
    const err = new ErrorObject(
      `http://localhost:${PORT}${req.url} not found`,
      404
    );
    next(err);
  });


module.exports = app;