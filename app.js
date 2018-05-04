var express = require('express');
var app = express();
var port = process.env.port || 2000;
var config = require('./server/config')
var mongoose = require('mongoose');
var cors = require('cors')
var usersController = require('./server/controllers/usersController');
var authMiddleware = require('./server/middlewares/authMiddleware');

//setup the secret 
app.use(cors())
app.set('superSecret', config.getSecret())

//Init connection to the database
mongoose.connect(config.getDbConnectionString(), { useMongoClient: true });
//import all of the controllers
usersController(app);
//send the default response
app.get('*', function(request, response) {
  response.send("Web App");
});
//start the server
let server = require('http').Server(app);
server.listen(process.env.PORT || 8080, function() {
console.log("listening in port " + port)
});
