const express = require('express');
const router = express.Router();
const database = require('../database');
const {users, sessions} = require('../models');
const {v4 : uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {SECRET_KEY, EMAIL_ACCT, APP_PASSWORD, CLIENT} = process.env;

function sendMail(toaddr, timestamp, id) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
	port: 465,
	secure: true,
        auth: {
          user: EMAIL_ACCT,
          pass: APP_PASSWORD
        }
      });
      
      var ref = `${CLIENT}/session?id=${id}`;
      var link = `<a href=${ref}>link</a>`;
      var mailOptions = {
        from: EMAIL_ACCT,
        to: toaddr,
        subject: 'Tutoring Appointment',
        html: `Your appointment has been scheduled at ${timestamp} EST. Here is the ${link}.`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } 
      });
}

function helper(datetime, student, stuEmail, tutor, tutorEmail, res, end) {
  sessions.findOne({appt_time: datetime}).then(data => {
    if(data == null) {
      if(student == tutor) {
        return res.send({status: "error", msg: "This link is broken"});
      }

      var id = uuidv4().toString();
      users.findOne({username: student, verify: true}).then(query => {
        if(query == null) {
          return res.send({status: "error", msg: "This user doesn't exist"});
        }
        else {
          var date = new Date(datetime);
          var datestring = date.toLocaleString('en-US', {timeZone: 'America/New_York', dateStyle: 'short', timeStyle: 'short'});
          sendMail(stuEmail, datestring, id);
          sendMail(tutorEmail, datestring, id);
          var tmp = new sessions({appt_time: datestring, student: student, tutor: tutor, appt_id: id, end_time: end});
          tmp.save();
          return res.send({status: true, msg: "An appointment has been created"});
        }
      });
    }
    else {
      return res.send({status: false, msg: "You already created this appointment"});
    }
  }); 
}

function create(req, res) {
  var student = req.body.student;
  var tutor = req.body.tutor;
  var datetime = req.body.datetime;
  var hrs = parseInt(req.body.hrs, 10);
  var min = parseInt(req.body.min, 10);
  var token = req.cookies['token'];
  const db = database.dbconnect();
  var simple = new Date(datetime);
  simple.setHours(simple.getHours() + hrs);
  simple.setMinutes(simple.getMinutes() + min);
  var end = simple.toLocaleString('en-US', {timeZone: 'America/New_York', dateStyle: 'short', timeStyle: 'short'});

  if(student.length == 0 || datetime.length == 0 || token.length == 0)
    return res.status(200).send({status: false, msg: "Missing email address, date, or token"});

  async function func() {
    try {
      var data = jwt.verify(token, SECRET_KEY);
      var query = await users.findById(data.id) ;
      return true;
     }
     catch(ex) {
      console.log(ex.message);
      return false;
     } 
  };

  func().then(result => {
    if(!result) 
      return res.send({status: false, msg: "Not logged in"});

    users.findById(student).then(student => {
      var stu_user = student.username;
      var stu_email = student.email;

      users.findById(tutor).then(tutor => {
        var tutor_user = tutor.username;
        var tutor_email = tutor.email;
        helper(datetime, stu_user, stu_email, tutor_user, tutor_email, res, end);
      });
    })
  });
}

router.post('/', (req, res) => {
  create(req, res);
});

module.exports = router;
