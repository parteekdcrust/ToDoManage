const mongoose = require("mongoose");
require('dotenv').config();
const logger = require('./logger');
const initDB = () => {
    mongoose
        .connect(process.env.MONGO_URI, {
            useNewUrlParser: true
        })
        .then(() => {
            logger.info("Database connected successfully");
        })
        .catch((error) => {
            logger.error(error);
        });
};

const disconnectDB = () => {
    mongoose.disconnect();
    logger.info("Database disconnected successfully");
};

module.exports = { initDB, disconnectDB };