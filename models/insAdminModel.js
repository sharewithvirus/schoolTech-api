const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Class = require("./classModel");
const Staff = require("./staffModel");
const Student = require("./studentModel")
const RfDevice = require("./rfDeviceModel");


const InsAdminSchema = new mongoose.Schema({
    insStatus: {
        type: String,
        default: "Not Active"
    },
    insName: {
        type: String,
        required: true,
    },
    insEmail: {
        type: String,
        required: true,
        unique: true,
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        // required: true,
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        // required: true,
        minlength: 8,
    },
    rfDevices: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RfDevice",
        }
    ],
    classes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
        }
    ],
    staff: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
        }
    ],
    student: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        }
    ]
    });

    InsAdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

InsAdminSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
    ) {
    return await bcrypt.compare(candidatePassword, userPassword);
    };
const InsAdmin = mongoose.model("InsAdmin", InsAdminSchema);

module.exports = InsAdmin;
