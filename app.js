const app = module.exports = require('express')();
const bodyParser = require('body-parser');
const port = process.env.port || 2000;
const config = require('./server/config')
const dbConfig = require('./server/config/dbConfig');
const cors = require('cors')

// const authMiddleware = require('./server/middlewares/authMiddleware');
dbConfig(app);
//setup the secret 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors())
app.set('superSecret', config.getSecret())

//This use implements the controller routes, new controllers will be defined in /server/controllers/routes.js
app.use(require('./server/controllers/routes'));

//send the default response
app.get('/', function (request, response) {
  response.send("Recipe app is alive!");
});

/// catch 404 and forward to error handler when the app tries to reach a patch that doesn't exist
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//start the express server
let server = require('http').Server(app);
server.listen(port, function () {
  console.log("listening in port " + port)
});
