const express = require('express');
const router = express.Router();
const database = require('../database');
const bcrypt = require('bcryptjs');
const {users} = require('../models');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = process.env;

router.get('/', (req, res) => {
    var token = req.cookies['token'];
    var flag = true;

    async function func() {
        try {
          var data = jwt.verify(token, SECRET_KEY);
          var query = await users.findById(data.id) ;
          return query.username;
         }
         catch(ex) {
          console.log(ex.message);
          flag = false;
         } 
    };  

    func().then(usr => {
        if(flag) {
            users.findOne({username: usr, verify: true}).then(result => {
                if(result != null) {
                    res.send({status: true, user: result.username});
                }
                else {
                    res.send({status: false, user: 'none'});
                }
            });
        }
        else {
            res.send({status: false, user: 'none'});
        }
    });
});

router.post('/', (req, res) => {
    var usr = req.body.username;
    var passwd = req.body.password;

    if(usr.length == 0 || passwd.length == 0)
        return res.status(200).send({status: false, msg: "You forgot to include information"});

    const db = database.dbconnect();
    users.findOne({username: usr, verify: true}).then(data => {
        if(data == null) {
            return res.status(200).send({status: false, msg: "Failed to login"});
        }
        else if(data.verify == false) {
            return res.status(200).send({status: false, msg: "Your account hasn't been verified yet"});
        }
        
        bcrypt.compare(passwd, data.password).then(function(result) {
            if(result == true) {
                var id = data.id;
                var token = jwt.sign({ id }, SECRET_KEY, {
                    expiresIn: 3 * 60 * 60, //token only lasts 3 hours
                });
                return res
                    .cookie("token", token, {
                        withCredentials: true
                    })
                    .status(200)
                    .send({status: true, msg: "Logged in successfully"});
            }
            else {
                return res.status(200).send({status: false, msg: "Failed to login"});
            }
        });
    });
});

module.exports = router;