const mongoose = require("mongoose");
const User = require("../model/user");

exports.getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("No User found !");
  return user;
};

exports.getAllUsers = async () => {
  const users = await User.find();
  if (!users) throw new Error("No User found !");
  return users;
};

exports.deleteUserById = async (id) => {
  const user = await User.findOneAndUpdate(
    { _id: id },
    { isActive: false },
    { new: true }
  );
  return user;
};
