const mongoose = require("mongoose");

//const mongooseURI = "mongodb://localhost:27017/i-notebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
const { MONGO_URI } = require('../config/keys');
const connectToMongo = () => {
    mongoose.connect(MONGO_URI, () => {
        console.log("connected to mongoDB hi");
    });
}

module.exports = connectToMongo;