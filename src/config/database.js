const mongoose = require("mongoose")
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL

const connectDb = async() =>{
    await mongoose.connect(MONGO_URL)
}

module.exports = connectDb;