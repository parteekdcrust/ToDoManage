const mongoose = require("mongoose");
const userService = require('../services/admin_service');

exports.getAllUser = async(req,res)=>{
    try {
        if(req.loggedInUser.role != "Admin") throw new Error("User not authorized to get all users details"); 
        const users = await userService.getAllUsers();
        res.status(200).send(users);     
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:error.message
        })
    }
     
}
exports.getUserById = async (req,res)=>{
    try {
        if(req.loggedInUser.role != "Admin") throw new Error("User not authorized to get all users details");
        const id = req.params.id;
        const user = await userService.getUserById(id);
        res.status(200).send(user);   
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:error.message
        })
    }
    

}