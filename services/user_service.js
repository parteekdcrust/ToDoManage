const mongoose = require("mongoose");
const User  = require('../model/user');
exports.getUserById =async (id)=>{
    const user = await User.findById(id);
    return user; 
}