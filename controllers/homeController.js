"use strict";

const hmac = require('crypto-js/hmac-sha256');
const CryptoJS = require('crypto-js');

const Participant = require("../models/participant");

// SkyWay Peer Authentication
const secretKey = process.env.SKYWAY_SECRET_KEY; //書き換えの必要あり
const credentialTTL = 60 * 60 * 5;

function createSkywayCredential(peerId){
  const unixTimestamp = Math.floor(Date.now() / 1000);
  return {
    peerId,
    timestamp: unixTimestamp,
    ttl: credentialTTL,
    authToken: calculateAuthToken(peerId, unixTimestamp)
  };
}

function calculateAuthToken(peerId, timestamp) {
  const hash = CryptoJS.HmacSHA256(`${timestamp}:${credentialTTL}:${peerId}`, secretKey);
  return CryptoJS.enc.Base64.stringify(hash);
}

// exports.getAllParticipants = (req, res, next) => {
//     Participant.find({}, (error, participants) => {
//       if (error) next(error);
//       req.data = participants;
//       next();
//     });
//   };

module.exports ={
    Joinmeeting: (req, res) => {
        // const roomId = document.getElementById('js-room-id');
        // roomId.value= req.body['roomname'];
    
        console.log(req.body['roomname']);
        res.render("home");
    },
    getAllparticipants:(req, res) => {
        Participant.find({})
          .exec()
          .then(participants => {
            res.render("participants", {
              participants: participants
            });
          })
          .catch(error => {
            console.log(error.message);
            return [];
          })
          .then(() => {
            console.log("promise complete");
          });
      },
      saveParticipant:(req, res) => {
        const roomname = req.body.roomname;
        const yourname = req.body.yourname;
        const newparticipant = new Participant({ roomname, yourname });

        newparticipant
          .save()
          .then(result => {
            const credential = JSON.stringify(createSkywayCredential(yourname));
            res.render("home", { roomname, yourname, credential });
          })
          .catch(error => {
            if (error) res.send(error);
          });
      }

};
