const mongoose = require("mongoose");
const userService = require("../services/admin_service");
const logger = require('../config/logger'); 

exports.getAllUser = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).send(users);
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    res.status(200).send(user);
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    const result = await userService.deleteUserById(id);
    res.status(200).json({
      message: "User had become Inactive",
    });
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
