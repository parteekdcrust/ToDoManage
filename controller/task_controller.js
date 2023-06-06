const mongoose = require("mongoose");
const User = require("../model/user");
const Task = require("../model/task");
const taskService = require("../services/task_service");
const userService = require("../services/admin_service");
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.createTask = async (req, res) => {
  try {
    const user = await userService.getUserById(req.loggedInUser._id);
    if (!user) throw new Error("Not authenticated user");
    const { title, description, priority, dueDate, assignee } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      assignee,
      createdBy: user._id,
    });
    // task.createdBy = user._id;
    const _id = await taskService.createTask(task);
    res.status(201).json({
      _id: _id,
      message: "Task created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const user = req.loggedInUser;
    if(user.role != "Admin") throw new Error("User not authorized to view all tasks");
    const tasks = await taskService.getAllTasks();
    res.status(200).send(tasks);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getTask = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.loggedInUser;
    const task = await taskService.getTask(id);
    if((user._id.toString() != task.createdBy.toString()) && (user.role != "Admin") ) throw new Error("User not authorized to view the task");
    res.status(200).send(task);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.loggedInUser;
    const task = await taskService.getTask(id);
    if ((user._id.toString() != task.createdBy.toString()) && (user.role != "Admin") ) {
      throw new Error("User not authorized to delete the task");
    }
    const result = await taskService.deleteTask(id);
    res.status(200).json({
      message: "Task Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
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
    const task = await taskService.getTask(id);
    if (user._id.toString() != task.createdBy.toString() && (user._id.toString() != task.assignee.toString())) {
      throw new Error("User not authorized to assign the task");
    }
    const result = await taskService.assignTask(id, assigneeEmail);

    //sending notification via email to assignee about task assignmnent
    const transporter = nodemailer.createTransport({
      // connect with the smtp
      service: "gmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Message from TodoManager" <process.env.AUTH_EMAIL>`, // sender address
      to: assigneeEmail, // list of receivers
      subject: "Task Assignment", // Subject line
      html: `<b>You are assigned a task with ${id} taskId</b>`, // html body
    });

    res.status(200).json({
      message: "Task assigned successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const availableStatus = ["ToDo", "In Progress", "Done"];
    const id = req.params.id;
    const task = await taskService.getTask(id);
    const user = req.loggedInUser;
    if(task.assignee.toString() != user._id.toString() ) throw new Error("User not authorized to change status");
    const status = req.body.status;
    if (!availableStatus.includes(status)) throw new Error("Invalid Status");
    const result = await taskService.changeStatus(id, status);
    res.status(200).json({
      message: "Task Status changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
