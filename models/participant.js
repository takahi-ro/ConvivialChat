"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose");

var participantSchema = new Schema({
    roomname:{
        type: Number,
        min: [1000, "Zip code too short"],
        max: 9999
    },
    yourname:{
        type: String,
        required: true

    }
    
},
{
    timestamps: true
  });

module.exports = mongoose.model("Participant", participantSchema);
