require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

const userRouter = require("./routes/userRoute");
const adminRouter = require("./routes/adminRoute");
// const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
// const swaggerJSDocs = YAML.load("./api.yaml");

const dbUrl = process.env.DATABASE;

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
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is runing on port ${port}!`));
