"use strict";

const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  Participant = require("./models/participant");

  mongoose.Promise = global.Promise;
  

  mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/skyway_db",
    {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false,useCreateIndex:true}
  );
  
  const db = mongoose.connection;

  db.once("open",() => {
    console.log("Successfully connected to MongoDB useing Mongoose!");
  });

app.set("view engine", "ejs");

app.set("port", process.env.PORT || 3000);

app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/home",homeController.saveParticipant);

app.get("/participants",homeController.getAllparticipants, (req, res, next) => {
  res.render("participants", { participants: req.data });
});

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
  });


