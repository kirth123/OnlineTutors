const express = require('express');
const router = express.Router();
const database = require('../database');
const {users} = require('../models');
const bcrypt = require('bcryptjs');
const {v4 : uuidv4} = require('uuid');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const {EMAIL_ACCT, APP_PASSWORD, SECRET_KEY, SERVER} = process.env;

function sendMail(toaddr, mytoken) {
  var link = `${SERVER}/verify?token=${mytoken}`;

  var transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_ACCT,
        pass: APP_PASSWORD
      }
    });
    
  var mailOptions = {
    from: EMAIL_ACCT,
    to: toaddr,
    subject: 'Verify your account',
    html: `<a href=${link}>Verify email</a>`
  };
      
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } 
    else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function update(req, res) {
  var subject = req.body.subject;
  var desc = req.body.desc;
  var name = req.body.name;
  var token = req.cookies['token'];
  const db = database.dbconnect();
 
  if(desc.split(' ').length > 50) 
    return res.status(200).send({status: false, msg: "Your description must be shorter than 50 words"});

  async function func() {
    try {
      var data = jwt.verify(token, SECRET_KEY);
      var query = await users.findById(data.id);
      return query.username;      
    }
    catch(ex) {
      console.log(ex.message);
      return res.status(200).send({status: false, msg: "Not logged in"});
    }
  };

  func().then(usr => {
    users.findOne({username: usr, verify: true}).then(data => {
      data.name = name;
      data.desc = desc;
      data.subject = subject;
      data.save();
      return res.status(200).send({status: true, msg: 'Profile updated'});
    });
  });
}

function register(req, res) {
  var emailaddr = req.body.email;
  var usr = req.body.username;
  var passwd = req.body.password;
  var saltRounds = 10;

  if(emailaddr.length == 0 || usr.length == 0 || passwd.length == 0) {
    return res.status(200).send({status: false, msg: "You forgot to include information"});
  }
  else if(usr.includes(passwd)) {
    return res.status(200).send({status: false, msg: "Password shouldn't contain username"});
  }
    
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(passwd, salt, function(err, hash) {
      if(err) {
        throw err;
      }
      else {
        const db = database.dbconnect();
        users.findOne({$or: [{email: emailaddr}, {username: usr}]}).then(data => {
          if(data == null) {
            var token = uuidv4().toString();
            sendMail(emailaddr, token);
            var user = new users({email: emailaddr, username: usr, password: hash, verify: false, verify_token: token});
            user.save();
            res.send({status: true, msg: "Check your email for verification link"});
          }
          else {
            res.send({status: false, msg: "This email address or username already exists"});
          }
        });

        return user;
      }
    });
  });   
}

router.post('/', (req, res) => {
  register(req, res);
});

router.put('/', (req, res) => {
  update(req, res);
});

module.exports = router;
