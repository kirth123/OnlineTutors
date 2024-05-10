const express = require('express');
const router = express.Router();
const database = require('../database');
const {users} = require('../models');

router.get('/', (req, res) => {
    var token = req.query.token;
    const db = database.dbconnect();

    users.findOne({verify_token: token}).then(data => {
        if(data == null)
            return res.status(200).send("Either your link is broken or your email was already verified");

        if(!data.verify) {
            data.verify = true;
            data.verify_token = undefined;
            data.save();
            return res.status(200).send("Your email has been verified");
        }
    });
});

module.exports = router;
