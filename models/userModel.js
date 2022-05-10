const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  height: {
    type: String,
  },
  physicalType: {
    type: String,
  },
  region: {
    type: String,
  },
  lookingFor: {
    type: String,
  },
  sexualOrientation: {
    type: String,
  },
  relationshipStatus: {
    type: String,
  },
  education: {
    type: String,
  },
  nationality: {
    type: String,
  },
  religion: {
    type: String,
  },
  children: {
    type: String,
  },
  autoLocation: {
    type: String,
  },
  annualIncome: {
    type: String,
  },
  alcoholConsumption: {
    type: Boolean,
  },
  hobbies: {
    type: String,
  },
  zipCode: {
    type: Number,
  },
  smokes: {
    type: Boolean,
  },
  bodyArt: {
    type: String,
  },
  vaccine: {
    type: String,
  },
  sign: {
    type: String,
  },
  festiches: {
    type: String,
  },
  whereAmINow: {
    type: String,
  },
  personality: {
    type: String,
  },
  qualities: {
    type: String,
  },
  GeolocationByDistance: {
    type: String,
  },
  onlineSeen: {
    type: Boolean,
  },
  hideAge: {
    type: Boolean,
  },
  yourPlan: {
    type: String,
    // enum: ["free", "gold", "diamond"],
  },
  expectFromRelationship: {
    type: String,
  },
  aboutMe: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    select: false,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
module.exports = mongoose.model("User", UserSchema);
