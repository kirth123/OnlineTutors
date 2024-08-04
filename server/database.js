const mongoose = require("mongoose");
require("dotenv").config();
const {MONGO_URL} = process.env;

function dbconnect() {
    mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    return mongoose.connection;
}

module.exports = {dbconnect};