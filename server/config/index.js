var configValues = require('./config');

module.exports = {

    getDbConnectionString: function() {
        return 'mongodb://' + configValues.uname + ':' + configValues.pwd + '@ds233748.mlab.com:33748/webapp-colman';
    },

    getSecret: function() {
      return configValues.secret;
    },

    getSendGridKey: function() {
      return configValues.sendgrid;
    }

}
