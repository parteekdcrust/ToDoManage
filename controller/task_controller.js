const mongoose = require("mongoose");
const User = require("../model/user");
const Task = require("../model/task");
const taskService = require("../services/task_service");
const userService = require("../services/admin_service");
const { sendEmail } = require('../config/send_email');
const logger = require('../config/logger');
require("dotenv").config();

exports.createTask = async (req, res) => {
  try {
    const user = await userService.getUserById(req.loggedInUser._id);
    if (!user) throw new Error("Not authenticated user");
    const { title, description, priority, dueDate } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      createdBy: user._id,
      assignee: user._id,
    });
    const _id = await taskService.createTask(task);
    res.status(201).json({
      _id: _id,
      message: "Task created successfully",
    });
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const {priority, status} = req.query;
    const user = req.loggedInUser;
    const tasks = await taskService.getAllTasks(user,priority,status);
    res.status(200).send(tasks);
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getTask = async (req, res) => {
  try {
    const user = req.loggedInUser;
    const id = req.params.id;
    const task = await taskService.getTask(id,user);
    res.status(200).send(task);
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.loggedInUser;
    const task = await taskService.getTask(id,user);
    const result = await taskService.deleteTask(task,user);
    res.status(200).json({
      message: "Task Deleted Successfully",
    });
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.loggedInUser;
    const { assigneeEmail } = req.body;
    const task = await taskService.getTask(id,user);
    const result = await taskService.assignTask(user ,task, assigneeEmail);
    const html = `<p>You have been assigned a task by ${user.name} and the link to the task is <a href="https://to-do-manage.onrender.com/api/auth/task/${id}">Assigned Task</a></p>` // html body
    // const html=  `<b>You are assigned a task with ${id} taskId</b>` // html body;
    await sendEmail(assigneeEmail,html);
    res.status(200).json({
      message: "Task assigned successfully",
    });
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.loggedInUser;
    const task = await taskService.getTask(id,user);
    const status = req.body.status;
    const result = await taskService.changeStatus(status,user,task);
    res.status(200).json({
      message: "Task Status changed successfully",
    });
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};


/*
"requestBody": {
  "required": true,
  "content": {
      "application/json": {
          "schema": {
              "$ref": "#/definitions/ResetPassInput"
          }
      }
  }
},
*/