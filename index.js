const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes')
const ErrorObject = require('./utils/error');

const app = express();

//body parser
app.use(express.json())

//Routes
// app.use('/api/v1/auths', authRoutes)
app.use('/api/v1/users', userRoutes)

// app.all("*", (req, res, next) => {
//     const err = new ErrorObject(
//       `http://localhost:${PORT}${req.url} not found`,
//       404
//     );
//     next(err);
//   });

module.exports = app;