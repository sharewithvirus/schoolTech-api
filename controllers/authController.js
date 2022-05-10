const User = require("../models/userModel");
const Admin = require("../models/adminModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.userSignup = async (req, res) => {
  try {
    if (req.body.passwordConfirm === req.body.password) {
      const newUser = await User.create({
        profileImage: req.body.profileImage,
        userName: req.body.userName,
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        profession: req.body.profession,
        height: req.body.height,
        physicalType: req.body.physicalType,
        region: req.body.region,
        lookingFor: req.body.lookingFor,
        sexualOrientation: req.body.sexualOrientation,
        relationshipStatus: req.body.relationshipStatus,
        education: req.body.education,
        nationality: req.body.nationality,
        religion: req.body.religion,
        children: req.body.children,
        autoLocation: req.body.autoLocation,
        annualIncome: req.body.annualIncome,
        alcoholConsumption: req.body.alcoholConsumption,
        hobbies: req.body.hobbies,
        zipCode: req.body.zipCode,
        smokes: req.body.smokes,
        bodyArt: req.body.bodyArt,
        vaccine: req.body.vaccine,
        sign: req.body.sign,
        festiches: req.body.festiches,
        whereAmINow: req.body.whereAmINow,
        personality: req.body.personality,
        qualities: req.body.qualities,
        GeolocationByDistance: req.body.GeolocationByDistance,
        onlineSeen: req.body.onlineSeen,
        hideAge: req.body.hideAge,
        yourPlan: req.body.yourPlan,
        expectFromRelationship: req.body.expectFromRelationship,
        aboutMe: req.body.aboutMe,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
      });
      await createSendToken(newUser, 201, res);
    } else {
      res.status(200).json({
        status: "success",
        message: "password should be same ",
      });
    }
  } catch (error) {
    console.log("error with signup");
  }
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: "sucess",
    token,
    data: {
      user: user,
    },
  });
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(200).json({
        status: "success",
        message: "enter password  username",
      });
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(403).json({
        status: "invalid password or username",
        data: {
          user,
        },
      });
    } else {
      createSendToken(user, 200, res);
    }
  } catch (error) {}
};

exports.adminSignup = async (req, res) => {
  try {
    if (req.body.passwordConfirm === req.body.password) {
      const newAdmin = await Admin.create({
        profileImage: req.body.profileImage,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
      });
      await createSendToken(newAdmin, 201, res);
    } else {
      res.status(200).json({
        status: "success",
        message: "password should be same ",
      });
    }
  } catch (error) {
    console.log("error with signup");
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(200).json({
        status: "success",
        message: "enter password  adminname",
      });
    }
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin || !(await admin.correctPassword(password, admin.password))) {
      res.status(403).json({
        status: "invalid password or adminname",
        data: {
          admin,
        },
      });
    } else {
      createSendToken(admin, 200, res);
    }
  } catch (error) {}
};
