var mongoose = require('mongoose');
var config = require('./index');
module.exports = (app) => {
    //Init connection to the database
mongoose.connect(config.getDbConnectionString(), { useMongoClient: true });
}