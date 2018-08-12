var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: Boolean,
  facebookId: {
    type: String
  },
  reset_password_token: String,
  reset_password_expiration: Date,
  dateCreated: { type: Date, default: Date.now },
  likedRecipes: [String],
  predictedCategory: String,
});

var Users = mongoose.model('Users', userSchema);

module.exports = Users;