var Users = require('../models/userModel');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var fs = require('fs');
var appRoot = require('app-root-path');

module.exports = function (app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.post('/api/users/register', function (req, res) {
        const {email, password, firstName, lastName} = req.body;
        if (!email || !password || !firstName || !lastName){
            res.status(400).send("one of the parameters are missing");
            return;
        }
        var hashedPassword = bcrypt.hashSync(req.body.password);
        Users.findOne({
            email: req.body.email
        }, ((err, user) => {
            if (user) {
                res.status(200).send("User already registered");
            } else {
                Users.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hashedPassword,
                    isAdmin: false
                }, ((err, user) => {
                    if (err) {
                        res.status(400);
                    }
                    const payload = {
                        _id: user._id,
                        isAdmin: user.isAdmin
                    };
                    // create a token
                    var token = jwt.sign(payload, app.get('superSecret'), {});
                    let responseObj = {
                        token: token,
                        userId: user._id,
                    }
                    res.status(200).send(responseObj);
                }));
            }
        }));

    });

    app.post('/api/users/login', function (req, res) {
        const {email, password} = req.body;
        if (!email || !password){
            res.status(400).send("one of the parameters is missing");
            return;
        }
        var hashedPassword = bcrypt.hashSync(req.body.password);
        Users.findOne({
            email: req.body.email.toLowerCase()
        }, (err, user) => {
            console.log(user);
            if (err) throw err;
            if (!user) {
                res.status(200).send(undefined);
            } else {
                bcrypt.compare(req.body.password, user.password, ((err, result) => {
                    if (result === true) {
                        const payload = {
                            _id: user._id,
                            isAdmin: user.isAdmin
                        };
                        var token = jwt.sign(payload, app.get('superSecret'), {});
                        let userObj = {
                            token: token,
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            _id: user._id,
                        };


                    } else {
                        res.status(200).send(undefined);
                    }
                }));
            }

        });
    });

}