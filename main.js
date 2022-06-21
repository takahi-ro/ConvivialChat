"use strict";

const express = require("express");
const app = express();
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const Participant = require("./models/participant");
mongoose.Promise = global.Promise;

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/skyway_db", //ローカル環境で動かすときに書き換えの必要あり
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
);

const db = mongoose.connection;

db.once("open",() => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("view engine", "ejs");

app.set("port", process.env.PORT || 3000);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/home", homeController.saveParticipant);

app.get("/participants", homeController.getAllparticipants, (req, res, next) => {
  res.render("participants", { participants: req.data });
});

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
