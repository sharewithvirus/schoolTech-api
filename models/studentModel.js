const mongoose = require("mongoose");
const Class = require("./classModel");
const User = require("./userModel");
const InsAdmin = require("./insAdminModel");
const Attendance = require("./attendanceModel");

const StudentSchema = new mongoose.Schema({
srNumber: {
    type: Number,
},
studentFirstName: {
    type: String,
},
studentMiddleName: {
    type: String,
},
studentLastName: {
    type: String,
},
fathersName: {
    type: String,
},
mothersName: {
    type: String,
},
dob: {
    type: Date,
},
address: {
    type: String,
},
mobileNumber1: {
    type: Number,
    minlength: 10,
    maxlength: 10,
},
mobileNumber2: {
    type: Number,
    minlength: 10,
    maxlength: 10,
},
aadharNumber: {
    type: Number,
    minlength: 12,
    maxlength: 12,
},
institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InsAdmin",
},
classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
},
parents: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
],
rfCardNumber: [
    {
        type: Number,
    }
],
attendanceText: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance",
    }
],
telegramChatId: {
    type: String,
}
});

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
