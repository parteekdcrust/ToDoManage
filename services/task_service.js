const mongoose = require("mongoose");
const Task = require("../model/task");
const User = require("../model/user");
const logger = require('../config/logger');

exports.createTask = async (task) => {
  const result = await task.save();
  return result._id;
};

exports.getTask = async (id,user) => {
  let task;
  task =await Task.findById(id);
  if (!task) throw new Error("Task not found");
  if(user.role == "Admin" ) return task;
  else if (user.role == "Regular") 
  {
    if(task.createdBy.toString() == user._id.toString() || task.assignee.toString() == user._id.toString()) return task; 
  }
  throw new Error("User not Authorized to get the task");
};

exports.getAllTasks = async (user, priority,status) => {
  let tasks;
  if (priority && status) {
    if (user.role == "Admin") tasks = await Task.find({ priority: priority, status:status });
    else if (user.role == "Regular")
      tasks = await Task.find({ priority: priority, createdBy: user._id,status:status  });
  } 
  else if (priority)
  {
    if (user.role == "Admin") tasks = await Task.find({ priority: priority});
    else if (user.role == "Regular")
      tasks = await Task.find({ priority: priority, createdBy: user._id });
  }
  else if (status) 
  {
    if (user.role == "Admin") tasks = await Task.find({ status:status });
    else if (user.role == "Regular")
      tasks = await Task.find({createdBy: user._id,status:status  });
  }
  else {
    if (user.role == "Admin") tasks = await Task.find();
    else if (user.role == "Regular")
      tasks = await Task.find({ createdBy: user._id });
  }
  if (!tasks) throw new Error("Tasks not found");
  return tasks;
};

exports.deleteTask = async (task, user) => {
  let res;
  if (user.role == "Admin")
    res = await Task.findOneAndDelete({ _id: task._id });
  else if (user.role == "Regular") {
    if (task.createdBy == user._id)
      res = await Task.findOneAndDelete({ _id: task._id });
    else throw new Error("User not authorized !");
  }
  return res;
};

exports.assignTask = async (user, task, assigneeEmail) => {
  if (
    user._id.toString() != task.createdBy.toString() &&
    user._id.toString() != task.assignee.toString()
  ) {
    throw new Error("User not authorized to assign the task");
  }
  const assignee = await User.findOne({ email: assigneeEmail });
  if (!assignee) throw new Error("Assignee not found");
  const newTask = await Task.findOneAndUpdate(
    { _id: task._id },
    { assignee: assignee._id },
    { new: true }
  );
  newTask.save();
  return newTask;
};

exports.changeStatus = async (status, user, task) => {
  const availableStatus = ["ToDo", "In Progress", "Done"];
  if (task.assignee.toString() != user._id.toString())
    throw new Error("User not authorized to change status");
  if (!availableStatus.includes(status)) throw new Error("Invalid Status");
  let res;
  if (status == "ToDo") {
    if (task.status == "ToDo") {
      //update status
      res = await Task.findOneAndUpdate(
        { _id: task._id },
        { status: status },
        { new: true }
      );
    } else throw new Error("Invalid Transition");
  } else if (status == "In Progress") {
    if (task.status == "ToDo") {
      //update status
      res = await Task.findOneAndUpdate(
        { _id: task._id },
        { status: status },
        { new: true }
      );
    } else throw new Error("Invalid Transition");
  } else if (status == "Done") {
    if (task.status == "In Progress") {
      //update status
      res = await Task.findOneAndUpdate(
        { _id: task._id },
        { status: status },
        { new: true }
      );
    } else throw new Error("Invalid Transition");
  }
  await task.save();
  return task;
};
