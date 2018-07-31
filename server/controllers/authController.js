const app = require('../../app');
var Users = require('../models/userModel');
const router = require('express').Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var fs = require('fs');
var appRoot = require('app-root-path');

    router.post('/login', (req, res) => {
        const {email, password} = req.body;
        
    });


    /**
     * Register a new user
     * This method checks for an existing user based on his email address, if the adress does not
     * exist it creates a  new user, stores the hashed password in the database and create
     * an authentication token so the user will be able to use it in each request
     */
    router.post('/register', function (req, res) {
      //extract the params from the request body  
        const {email, password, firstName, lastName} = req.body;
        //check that we have all of them
        if (!email || !password || !firstName || !lastName){
            res.status(400).send("one of the parameters are missing");
            return;
        }
        //hash the password the user entered using bcrypt
        var hashedPassword = bcrypt.hashSync(req.body.password);
        //check that this email address is not in use
        Users.findOne({
            email: req.body.email
        }, ((err, user) => {
            if (user) {
                res.status(200).send("User already registered");
            } else {
                //create a user based on these params
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
                    // create a token - the user will have to use this token in the header of each request
                    var token = jwt.sign(payload, app.get('superSecret'), {});
                    let responseObj = {
                        userId: user._id,
                        firstName,
                        lastName,
                        email,
                        token,
                    }
                    //return the user an object with his account id and his token
                    res.status(200).send(responseObj);
                }));
            }
        }));

    });

module.exports = router