const mongoose = require("mongoose");

const RawAttendanceSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Not Marked"
    },
    cardId: {
        type: Number,
    },
    deviceAttendanceTime: {
        type: Date,
        required: true,
    },
    timeToHit: {
        type: Date,
        require: true,
    }
});

module.exports = mongoose.model("RawAttendance", RawAttendanceSchema);
