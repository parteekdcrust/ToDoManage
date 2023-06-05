const mongoose = require("mongoose");
const User = require("../model/user");
const Task = require('../model/task');
const taskService = require('../services/task_service'); 

exports.createTask = async (req,res) => {
    try {
        const {title,description, priority, dueDate,createdBy, assignee,status} = req.body;
        const task = new Task({title,description, priority, dueDate, createdBy,assignee,status});

        const _id = await taskService.createTask(task);  
        res.status(201).json({
            _id:_id,
            message: "Task created successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:error.message
        })
    }
}

exports.getAllTasks = async (req,res)=>{
    try {
        const tasks = await taskService.getAllTasks();
        res.status(200).send(tasks);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:error.message
        })
    }
}

exports.getTask =async (req,res)=>{
    try {
        const id = req.params.id;
        const task = await taskService.getTask(id);
        res.status(200).send(task);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:error.message
        })
    }
};

exports.deleteTask = async (req,res)=>{
    try {
        const id = req.params.id;
        const user = req.loggedInUser;
        console.log(user._id);
        const task = await taskService.getTask(id);
        console.log(task.createdBy);
        if(user._id != task.createdBy) {
            throw new Error("User not authorized") 
        }
        const res = await taskService.deleteTask(id);
        res.status(200).json({
            message: "Task Deleted Successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:error.message
        })
    }
};