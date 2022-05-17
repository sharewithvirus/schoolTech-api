const mongoose = require("mongoose");
const User = require("./userModel");
const Student = require("./studentModel");
const InsAdmin = require("./insAdminModel");
const Class = require("./classModel");

const StaffSchema = new mongoose.Schema({
staffId: {
    type: String,
},
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
},
staffFirstName: {
    type: String,
},
staffMiddleName: {
    type: String,
},
staffLastName: {
    type: String,
},
institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InsAdmin",
},
Roles: [
    {
        Types: String,
    }
],
ClassHead: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
    }
],
});

const Staff = mongoose.model("Staff", StaffSchema);

module.exports = Staff;
