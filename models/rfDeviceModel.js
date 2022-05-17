const mongoose = require("mongoose");
const InsAdmin = require("./insAdminModel");

const rfDeviceSchema = new mongoose.Schema({
deviceId: {
    type: String,
},
deviceType: {
    type: String,
},
relatedToInstitute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InsAdmin",
}
});

module.exports = mongoose.model("RfDevice", rfDeviceSchema);