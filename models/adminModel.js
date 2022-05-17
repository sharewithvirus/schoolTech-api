const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const InsAdmin = require("./insAdminModel");
const Student = require("./studentModel");
const User = require("./userModel");

const AdminSchema = new mongoose.Schema({
  adminUserName: {
    type: String,
    unique: true,
  },
  adminName: {
    type: String,
    required: true,
  },
  adminEmail: {
    type: String,
    required: true,
    unique: true,
  },
  adminPassword: {
    type: String,
    minlength: 8,
    select: false,
  },
  adminPasswordConfirm: {
    type: String,
    minlength: 8,
  },
  pendingInstitute: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsAdmin",
    }
  ],
  approveInstitute: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsAdmin",
    }
  ],
  blockedInstitute: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsAdmin",
    }
  ],
  student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    }
  ],
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  blockedUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

AdminSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
