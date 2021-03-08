"use strict";
const Participant = require("../models/participant");


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
        let newparticipant = new Participant({
          roomname: req.body.roomname,
          yourname: req.body.yourname
        });
        let value1 = req.body.roomname,
           value2 = req.body.yourname;
        newparticipant
          .save()
          .then(result => {
            res.render("home",{value1: value1,value2: value2});
          })
          .catch(error => {
            if (error) res.send(error);
          });
      }

};
