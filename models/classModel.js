const mongoose = require("mongoose");
const User = require("./userModel");
const Student = require("./studentModel");
const institute = require("./insAdminModel");
const Staff = require("./staffModel")

const ClassSchema = new mongoose.Schema({
classCode: {
    type: String,
},
className: {
    type: String,
},
classTitle: {
    type: String,
},
institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "institute",
},
ClassTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
},
student: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    }
],
});

const Class = mongoose.model("Class", ClassSchema);

module.exports = Class;
