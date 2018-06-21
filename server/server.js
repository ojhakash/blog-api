"use strict";

require("./config/config");
const _ = require("lodash");
const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = { mongoose };

const routes = require("./routers");

var app = express();
const port = process.env.PORT || 8000;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", routes);
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});
