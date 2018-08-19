const app = module.exports = require('express')();
const bodyParser = require('body-parser');
const config = require('./server/config')
const dbConfig = require('./server/config/dbConfig');
const router = require("express").Router();
const cors = require('cors')
const port = process.env.PORT || 2000;
var http = require('http').Server(app);
var io = require('socket.io')(http);
dbConfig(app);
var socketVar;
//setup the secret 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors())
app.options('*', cors())
app.set('superSecret', config.getSecret())

//This use implements the controller routes, new controllers will be defined in /server/controllers/routes.js
app.use(require('./server/controllers/routes'));

//send the default response
app.get('/', function (request, response) {
  response.send("Recipe app is alive!");
});

/// catch 404 and forward to error handler when the app tries to reach a patch that doesn't exist
app.use(function (req, res, next) {
  return res.status(404).send("404");
});


io.on('connection', function (socket) {
  socketVar = socket;
  console.log('a user connected');
  app.set('ioSocket', socket);
});

router.use(function (req, res, next) {
  next()
})
//start the express server
http.listen(process.env.PORT || 2000, function () {
  console.log('listening on *:2000');
});



