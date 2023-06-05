const mongoose = require("mongoose");
const Task = require('../model/task');
const { findOneAndDelete } = require("../model/user");

exports.createTask = async (task)=>{
    const result =  await task.save();
    return result._id;
};

exports.getTask = async (id) =>{
    const task = await Task.findById(id);
    if(!task) throw new Error("Task not found");
    return task;
}

exports.getAllTasks = async ()=>{
    const tasks = await Task.find();
    if(!tasks) throw new Error("Tasks not found");
    return tasks; 
}

exports.deleteTask = async(id)=>{
    const res = await findOneAndDelete({_id:id});
    return res;
}