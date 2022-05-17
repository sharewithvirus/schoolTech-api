    const mongoose = require("mongoose");
    const RfDevice = require("./rfDeviceModel");
    const Student = require("./studentModel");


    const AttendanceSchema = new mongoose.Schema({
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RfDevice",
        },
        attendanceStatus: {
            type: String,
            default: "Absent"
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        },
        attendanceTime: {
            type: Date,
        }
    });

    // UserSchema.pre("save", async function (next) {
    // if (!this.isModified("password")) return next();
    // this.password = await bcrypt.hash(this.password, 12);
    // this.passwordConfirm = undefined;
    // next();
    // });

    // UserSchema.methods.correctPassword = async function (
    // candidatePassword,
    // userPassword
    // ) {
    // return await bcrypt.compare(candidatePassword, userPassword);
    // };


    module.exports = mongoose.model("Attendance", AttendanceSchema);
