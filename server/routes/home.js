const express = require('express');
const router = express.Router();
const database = require('../database');
const {users} = require('../models');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = process.env;

function getTutors(req, res) {
  const db = database.dbconnect();
  var search = req.body.search;
  var token = req.cookies['token'];
  var result = {};
  var flag = true;

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

    users.find({$or: [{name: {$regex: search, $options: 'i'}}, {desc: {$regex: search, $options: 'i'}}, {subject: {$regex: search, $options: 'i'}}]}).then(data => {
      if(data == null) {
        res.send({status: false, msg: "We weren't able to find anything. Make your search more specific."});
      }
      else {
        for(var i = 0; i < data.length; i++) {
          if(data[i].username == user.username)
            continue
          result[i] = {student: user._id.toString(), tutor: data[i]._id, name: data[i].name, desc: data[i].desc, subject: data[i].subject};
        }
        res.send({status: true, msg: result});
      }
    }); 
  });
}

router.post('/', (req, res) => {
  getTutors(req, res);
});

module.exports = router;