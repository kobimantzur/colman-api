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


app.use(require('./server/controllers/routes'));

//send the default response
app.get('/', function(request, response) {
  response.send("Web App");
});
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//start the server
let server = require('http').Server(app);
server.listen(port, function() {
console.log("listening in port " + port)
});
