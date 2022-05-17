require("dotenv").config();
const express = require("express");
const app = express();
var url = require("url");
const cors = require("cors");
const path = require("path")
const axios = require("axios");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoute");
const adminRouter = require("./routes/adminRoute");
const attendanceRouter = require("./routes/attendance");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJSDocs = YAML.load("./api.yaml");

const TelegramBot = require('node-telegram-bot-api');

const token = `${process.env.BOTTOKEN}`;

// // Create a bot that uses 'polling' to fetch new updates
// const bot = new TelegramBot(token, {polling: true});


// -------------Import Models ----------------------

const Admin = require("./models/adminModel");
const InsAdmin = require("./models/insAdminModel");
const User = require("./models/userModel");
const Student = require("./models/studentModel")
const RawAttendance = require("./models/rawAttendanceModel");
const Attendance = require("./models/attendanceModel");
const RfDevice = require("./models/rfDeviceModel");
const moment = require("moment");
const Class = require("./models/classModel");


const bot = new TelegramBot(process.env.BOTTOKEN, {polling: true});
// const dbUrl = `${process.env.DB_URL}`; // For Server Data Base.
const dbUrl=`${process.env.DB_URL_L}` //For Local Data Base.

app.set("view engine", "ejs");
app.set("/views", path.join(__dirname, "/views"));


mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => {
    console.log("Database Successfully Connected...");
  })
  .catch((e) => {
    console.log("Something Went Wrong...", e);
  });

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    //   credentials: true,
  })
);
app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/attendance", attendanceRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));
app.use(express.urlencoded({ extended: true }));
const secret = `${process.env.SECRET}` || "Thisismysecret";

const store = new MongoStore({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("some", e);
});

app.use(cookieParser());

app.use(
  session({
    name: "SessionID",
    store,
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: Date.now() + 30 * 86400 * 1000,
    },
  })
);

bot.on('message', (message)=> {
    console.log(message.text);
    console.log(message.from.id);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const message = "Welcome to School Tech Bot. Please Enter your Studnet SRNO."
  bot.sendMessage(chatId, message);
});

bot.on('message', (msg)=> {
  const chatId = msg.chat.id;
  const msgh = msg.text;
  if(msg.text === Number){
    console.log(msg.text)
  }else {
    console.log("Not a Number", msg.text)
  }
  // if(msg)
})

// bot.command()

// bot.command('/Hi', ctx => {
//   console.log(ctx.from)
//   bot.telegram.sendMessage(ctx.chat.id, 'hello there! Welcome to School Tech.', {
//   })
// })


let todayDateTime= "";
function runTimeUpdate(){
  setInterval(oneSecondFunction, 1000);
  };
  
  function oneSecondFunction() {
  let time = moment().format()
      todayDateTime=time;
      // console.log(todayDateTime)
    }
  runTimeUpdate()

// app.get("/attendance?", 
// async (req, res) => {
//   try {
//     const { id, time, cid } = req.query;
//     let timeNow = new Date();
//     const rawAttendance = await new RawAttendance({
//       deviceId: id,
//       cardId: cid,
//       deviceAttendanceTime: time,
//       timeToHit: timeNow,
//     });
//     await rawAttendance.save();
//     res.send({
//       message: "In",
//     });
//     // chatId = "636502433";
//     // const bot = new TelegramBot(telegramToken, chatId);
//     // async function sendMessage() {
//     //   const response = await bot.sendMessage(
//     //     `
//     //       deviceId : ${id}, time : ${time}, cardId: ${cid},
//     //     `, {
//     //     chatId: "636502433",
//     //   });
//     // }
//     // sendMessage();
//   }catch {
//     console.log(`SomeThing went wrong at this endPoint(/attendance?)`);
//   }
// });

// app.get("/view-details/", async (req, res) => {
//   try {
//     const data = attendanceData.reverse();
//     res.render(
//       "pages/indexTable", { data: data}
//     );
//   }catch{
//     console.log(`SomeThing went wrong at this endPoint(/view-details/)`);
//   }
// });

app.get("/", async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.send(admins);
  } catch {
    console.log(`SomeThing went wrong at this endPoint(/)`);
  }
});

app.get("/super-admin", (req, res) => {
  res.render("SuperAdmin");
});

app.post("/super-admin", async (req, res) => {
  try {
    const {
      adminUserNameText,
      adminNameText,
      adminEmailText,
      adminPasswordText,
      adminPasswordConfirmText,
    } = req.body;
    
    const admin = await new Admin({
      adminUserName: adminUserNameText,
      adminName: adminNameText,
      adminEmail: adminEmailText,
      password : adminPasswordText,
      passwordConfirm: adminPasswordConfirmText
    });
    await admin.save();
    res.redirect("/");
  } catch (error) {
    console.log(`Something Went Wrong at Path(/super-admin), Error:- ${error}`)
}});

app.post("/ins-register", async (req, res) => {
  try {
    const admins = await Admin.findById({ _id: `${process.env.ADMIN_ID}` });
    const existInstitute = await InstituteAdmin.findOne({
      name: req.body.name,
    });
    const existAdmin = await Admin.findOne({ adminUserName: req.body.name });
    const existUser = await User.findOne({ username: req.body.name });
    if (existAdmin) {
      res.status(200).send({ message: "Username already exists" });
    } else if (existUser) {
      res.status(200).send({ message: "Username already exists" });
    } else {
      if (existInstitute) {
        res.send({ message: "Institute Existing with this Username" });
      } else {
        const institute = await new InstituteAdmin({ ...req.body });
        // institute.photoId = "1";
        // institute.coverId = "2";
        admins.pendingInstitute.push(institute);
        await admins.save();
        await institute.save();
        res.status(201).send({ message: "Institute", institute });
      }
    }
  } catch {
    console.log(`SomeThing Went Wrong at this EndPoint(/ins-register)`);
  }
});

// Super Admin ins Creation

app.post("/super-admin/:id/new-ins-creation", async (req, res) => {
  try {
    const { id } = req.params.id;
    const admins = await Admin.findById({ _id: id });
    const existInstitute = await InstituteAdmin.findOne({
      name: req.body.name,
    });
    const existAdmin = await Admin.findOne({ adminUserName: req.body.name });
    const existUser = await User.findOne({ username: req.body.name });
    if (existAdmin) {
      res.status(200).send({ message: "Username already exists" });
    } else if (existUser) {
      res.status(200).send({ message: "Username already exists" });
    } else {
      if (existInstitute) {
        res.send({ message: "Institute Existing with this Username" });
      } else {
        const institute = await new InstituteAdmin({ ...req.body });
        // institute.photoId = "1";
        // institute.coverId = "2";
        admins.approveInstitute.push(institute);
        await admins.save();
        await institute.save();
        res.status(201).send({ message: "Institute", institute });
      }
    }
  } catch {
    console.log(`SomeThing Went Wrong at this EndPoint(/ins-register)`);
  }
});

// Attendance Marking and Send Msg to Student
app.post("/student-attendance/mark-present/:aid", async (req, res) => {
  try {
    console.log("api Rought Hit")
  const { aid } = req.params;
  console.log(aid)
  const rawAtt = await RawAttendance.findById({_id: aid});
  const deviceText = await RfDevice.find({ deviceId: rawAtt.deviceId});
  const studentTextList = await Student.find({rfCardNumber: rawAtt.cardId});
  const studentText = await Student.findById({_id: studentTextList[0]._id});

  let attDate = moment(rawAtt.deviceAttendanceTime).format();
  console.log(attDate)
  const attendanceText = await new Attendance({
    deviceId: deviceText._id,
    attendanceStatus: "Present",
    studentId: studentText._id,
    attendanceTime: attDate,
  })
  console.log(attendanceText)
  console.log(attendanceText._id)
  studentText.attendanceText.push(attendanceText._id);
  rawAtt.status = "Marked";
  await rawAtt.save();
  await attendanceText.save();
  await studentText.save();
  console.log("student Mark Present SuccessFull");
  
  let morningSTime = new Date();
      morningSTime.setHours(06, 00, 00);
  let morningLTime = new Date();
      morningLTime.setHours(09, 00, 00);
  let eveningSTime = new Date();
      eveningSTime.setHours(12, 00, 00);
  let eveningLTime = new Date();
      eveningLTime.setHours(03, 00, 00);
      
    let msg = ""
if(moment(todayDateTime).format() < moment(morningLTime).format() && moment(todayDateTime).format() > moment(morningSTime).format()){
  msg = `Your Ward ${studentText.studentFirstName} ${studentText.studentMiddleName} ${studentText.studentLastName} is Present in School at ${moment(attendanceText.attendanceTime).format('LT')}.`
}else if(moment(todayDateTime).format() < moment(eveningLTime).format() && moment(todayDateTime).format() > moment(eveningSTime).format()){
  msg = `Your Ward is Out From School.`
}
if(studentText.telegramChatId){
  bot.sendMessage(studentText.telegramChatId, msg)
  // const bot = new TelegramBot(token, 636502433);
    // async function sendMessage() {
    //   const response = await bot.sendMessage( msg, Number(studentText.telegramChatId));
    //   console.log(response)
    // }
    sendMessage();
}
  } catch (error) {
    console.log(`something Went Wrong at path (/student-attendance/mark-present/:aid), error:- ${error}`)  
  }
});

  // const createIns = async() => {
  //   try {
  //     const adminText = await Admin.findById({_id: "6282c12a432b254ea11878e7" })
  //     console.log(adminText)
  //     const newIns = new InsAdmin({
  //       insName : "Bal Nikunj",
  //       insEmail : "email@BalNikunj.com",
  //       password : "admin@123",
  //       passwordConfirm : "admin@123",
  //       insStatus: "Activate"
  //     });
  //     adminText.approveInstitute.push(newIns._id)
  //     console.log(adminText.approveInstitute)
  //     await newIns.save();
  //     await adminText.save();
  //   } catch (error) {
  //     console.log(`Something Went Wrong, Error:- ${error}`)
  //   }
  // }
  // createIns();

  // const createClass = async() => {
  //   try {
  //         const insAdminText = await InsAdmin.findById({_id: "6282df0e7f88f82ed3ad01a1" });
  //         console.log(insAdminText)
  //         const newIns = new Class({
  //           classCode : "CA-07-A",
  //           className : "7th",
  //           classTitle: "A",
  //         });
  //         insAdminText.classes.push(newIns)
  //         console.log(insAdminText.classes)
  //         await newIns.save();
  //         await insAdminText.save();
  //       } catch (error) {
  //         console.log(`Something Went Wrong, Error:- ${error}`)
  //       }
  // }

  // createClass();

  // Import Excel File to MongoDB database
// const insertStudent = async(jsonPath) => {
//   const studentData = require(jsonPath);
//     console.log(studentData)
//     const adminText = await Admin.findById({ _id: process.env.ADMIN_ID })
//     const insText = await InsAdmin.findById({ _id: studentData[0].institute})
// for (let i = 0; i < studentData.length; i++) {
//       let dbDate =   studentData[i].dob;
//   let date = dbDate.slice(0, 2);
//   let month = dbDate.slice(3, 5);
//   let year = dbDate.slice(6, 10)
//   let DOB = new Date();
//       DOB.setDate(date);
//       DOB.setMonth(month);
//       DOB.setYear(year);
//       DOB.setHours(00, 00, 00)

//       const newStudent = new Student({
//         srNumber: studentData[i].SrNumber,
//         studentFirstName: studentData[i].studentFirstName,
//         studentMiddleName: studentData[i].studentMiddleName,
//         studentLastName: studentData[i].studentLastName,
//         fathersName: studentData[i].fathersName,
//         mothersName: studentData[i].mothersName,
//         dob: moment(DOB).format(),
//         address: studentData[i].address,
//         mobileNumber1: studentData[i].mobileNumber1,
//         mobileNumber2: studentData[i].mobileNumber2,
//         aadharNumber: studentData[i].aadharNumber,
//         institute: studentData[i].institute,
//         classId: studentData[i].classId,
//         rfCardNumber: studentData[i].rfCardNumber,
//       })
//     insText.student.push(newStudent);
//     adminText.student.push(newStudent);
//     await newStudent.save();
//   }
//   await insText.save();
//   await adminText.save();
// }
// insertStudent(`${__dirname}/filesUpload/studentData.json` )

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port ${port}!`));