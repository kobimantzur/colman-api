var bodyParser = require('body-parser');
var Users = require('../models/userModel');
var jwt = require('jsonwebtoken');
module.exports = function (app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(function (req, res, next) {
        if (!isAuthorizedUrl(req.originalUrl)) {
            //Needs to be authorized
            const token = req.body.token || req.query.token || req.headers['x-access-token'];
            if (token) {
                jwt.verify(token, app.get('superSecret'), ((err, decoded) => {
                    if (err) {
                        return res.status(403).json({
                            success: false,
                            message: 'Failed to authenticate token.'
                        });
                    } else {
                        req.decoded = decoded;
                        const userId = decoded._id;
                        Users.findOne({
                            _id: userId
                        }).then(((user) => {
                            req.user = user;
                            next();
                        }));
                    }
                }));
            } else {
                return res.status(401).send({
                    success: false,
                    message: 'No token provided.'
                });
            }
        } else {
            next();
        }
    });

    function isAuthorizedUrl(url) {
        if (!url) {
            return true;
        }
        let restrictedControllers = [
            'api/users',
        ];
        for (let i = 0; i < restrictedControllers.length; i++) {
            if (url.toLowerCase().indexOf(restrictedControllers[i]) != -1) {
                return false;
            }
        }
        return true;
    }
};