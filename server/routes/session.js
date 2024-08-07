const express = require('express');
const router = express.Router();
const database = require('../database');
const {users, sessions} = require('../models');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = process.env;

function validate(req, res) {
  var appt_id = req.query.id;
  var token = req.cookies['token'];
  const db = database.dbconnect();

  async function func() {
    try {
      var data = jwt.verify(token, SECRET_KEY);
      var query = await users.findById(data.id) ;
      return query.username;
    }
    catch(ex) {
      console.log(ex.message);
      return null;
    } 
  };

  func().then(result => {
    if(result == null)
      return res.send({status: false, msg: "Not logged in"});

    sessions.findOne({appt_id: appt_id}).then(data => {
      if(data == null) {
        res.send({status: false, msg: "This link is broken"});
      }
      else {
        var appt_time = new Date(data.appt_time);
        var end_time = new Date(data.end_time);
        var now = new Date();
    
        if(now < appt_time) {
          return res.send({status: false, msg: "It's not time for your appointment yet"});
        }
        else if(now > end_time) {
          return res.send({status: false, msg: "It's too late for your appointment"});
        }

        if(data.tutor == result) {
          res.send({status: true});
        }
        else if(data.student == result) {          
          res.send({status: true});
        }
        else {
          res.send({status: false, msg: "Not registered for this appointment"});
        }
      }
    });
  });
  
}
  
router.get('/', (req, res) => {
  validate(req, res);
});

module.exports = router;