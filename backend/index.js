const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const exec = require("child_process").exec;
require("dotenv").config();

const app = express();
app.use(cors("*"));
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../frontend/build")));

const port = process.env.PORT || "3000";
const http = require("http").Server(app);
http.listen(port, () => console.log(`listening on port ${port}`));


module.exports = app;