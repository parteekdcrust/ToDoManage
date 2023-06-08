const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9 ]*$/.test(v);
            },
            message: (props) =>
                `${props.value} contains special characters, only alphanumeric characters and spaces are allowed!`,
        },
    },
    description: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9 ]*$/.test(v);
            },
            message: (props) =>
                `${props.value} contains special characters, only alphanumeric characters and spaces are allowed!`,
        },
    },
    priority: {
        type:String,
        required: true
    },
    dueDate: {
        type:Date,
        required:true
    },
    assignee : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdOn: {
        type: Date,
        default: Date.now(),
        immutable: true,
    },
    status:{
        type:String,
        required: true,
        enum:["ToDo","In Progress","Done"],
        default:"ToDo"
    }
    
});

module.exports = mongoose.model("Task", TaskSchema);

