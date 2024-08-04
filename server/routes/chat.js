const express = require('express');
const router = express.Router();
const database = require('../database');
const {users, sessions, chats} = require('../models');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = process.env;

function retrieve(req, res) {
  var student = req.query.student;
  var tutor = req.query.tutor;
  var token = req.cookies['token'];
  const db = database.dbconnect();
  var result = {};

  async function func() {
    try {
      var data = jwt.verify(token, SECRET_KEY);
      var query = await users.findById(data.id) ;
      return query;
     }
     catch(ex) {
      console.log(ex.message);
      return null;
     } 
  };

  func().then(function(me) {
    if(me == null) 
      return res.send({status: false, msg: "Not logged in"});

    chats.find({$or: [{$and: [{from: student}, {to: tutor}]}, {$and: [{to: student}, {from: tutor}]}]}).sort({ _id: 1 }).then(docs => {
      if(docs != null) {
        for(var i = 0; i < docs.length; i++) {
          if(docs[i].from == me._id) {
            result[i] = {type: "send", msg: docs[i].msg};
          }
          else {
            result[i] = {type: "receive", msg: docs[i].msg};
          }
        }

        return res.send({status: true, msg: result});
      }
    });
  });
}

router.get('/', (req, res) => {
  retrieve(req, res);
});
      
function create(req, res) {
  var student = req.body.student;
  var tutor = req.body.tutor;
  var msg = req.body.msg;
  var token = req.cookies['token'];
  const db = database.dbconnect();

  async function func() {
    try {
      var data = jwt.verify(token, SECRET_KEY);
      var query = await users.findById(data.id);
      return query;
     }
     catch(ex) {
      console.log(ex.message);
      return null;
     } 
  };

  func().then(fromusr => {
    if(fromusr == null) 
      return res.send({status: false, msg: "Not logged in"});

    if(fromusr._id == tutor) {
      users.findById(student).then(tousr => {
        var chat = new chats({from: fromusr._id, to: tousr._id, msg: msg, tutor: fromusr._id, student: tousr._id, 
          fromUser: fromusr.name, toUser: tousr.name});
        chat.save();
      });
    }
    else {
      users.findById(tutor).then(tousr => {
        var chat = new chats({from: fromusr._id, to: tousr._id, msg: msg, tutor: tousr._id, student: fromusr._id, 
          fromUser: fromusr.name, toUser: tousr.name});
        chat.save();
      });
    }

    return res.send({status: true, msg: "Message received"});
  });
}

router.post('/', (req, res) => {
  create(req, res);
});

module.exports = router;