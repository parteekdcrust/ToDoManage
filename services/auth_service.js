const mongoose = require('mongoose');
const User = require('../model/user');


exports.signup = async (user)=>{
    const result = await user.save();
    return result._id;
}