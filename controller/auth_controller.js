const mongoose = require("mongoose");
const User = require("../model/user");
const authService = require("../services/auth_service");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({ name, email, password });
    const _id = await authService.signup(user);

    res.status(201).json({
      _id: _id,
      message: "User created succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
