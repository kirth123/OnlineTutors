const express = require('express');
const router = express.Router();
const database = require('../database');
const {users, chats} = require('../models');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = process.env;

function getPpl(req, res) {
  const db = database.dbconnect();
  var token = req.cookies['token'];
  var result = {};
  var set = new Set()
  var flag = true;
  var j = 0;

  async function func() {
    try {
      var data = jwt.verify(token, SECRET_KEY);
      var query = await users.findById(data.id) ;
      return query;
    }
    catch(ex) {
      console.log(ex.message);
      flag = false;
    } 
  };

  func().then(function(user) {
    if(!flag) 
      return res.send({status: false, msg: "Not logged in"});

    chats.find({$or: [{student: user._id}, {tutor: user._id}]}).then(data => {
      if(data != null) {
        for(var i = 0; i < data.length; i++) {
          if(user._id == data[i].tutor && !set.has(data[i].student)) {
            if(user.name == data[i].fromUser)
              result[j] = {student: data[i].student, tutor: data[i].tutor, other: data[i].toUser};
            else 
              result[j] = {student: data[i].student, tutor: data[i].tutor, other: data[i].fromUser};
            set.add(data[i].student);
          }
          else if(user._id == data[i].student && !set.has(data[i].tutor)) {
            if(user.name == data[i].fromUser)
              result[j] = {student: data[i].student, tutor: data[i].tutor, other: data[i].toUser};
            else 
              result[j] = {student: data[i].student, tutor: data[i].tutor, other: data[i].fromUser};
            set.add(data[i].tutor);
          }
          j++;
        }
        return res.send({status: true, msg: result});
      }
    }); 
  });
}

router.get('/', (req, res) => {
  getPpl(req, res);
});

module.exports = router;