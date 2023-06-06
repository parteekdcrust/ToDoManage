const mongoose = require("mongoose");
const userService = require('../services/user_service');

exports.getAllUsers = async(req,res)=>{
    try {
        console.log("inside user controller")
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