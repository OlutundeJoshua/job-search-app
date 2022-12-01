const mongoose = require('mongoose');

const dotenv = require('dotenv')
dotenv.config({path: './config.env'})


const app = require('./index.js');

const {PORT, DB_URL} = process.env

mongoose
    .connect(DB_URL)
    .then(() => console.log('DB Connected Successfully'))
    .catch((err) => console.log(err))

app.listen(PORT, () => console.log('Server is running!'))