const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * This schema defines how the recipe will look like in the database
 * userId will be the user that posted this recipe and comments will be every comment
 * a user post on it
 */
const recipeSchema = new Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  imagePath: {
    type: String
  },
  ingredients: [{ type: Schema.ObjectId, ref: "Ingredients", default: [] }],
  userId: {
    type: String
  },
  comments: [{ type: Schema.ObjectId, ref: "Comments" }],
  dateCreated: { type: Date, default: Date.now },
  longitude: String,
  latitude: String,
  address: String,
  restaurantName: String,
  categoryId: String
});

const Recipes = mongoose.model("Recipes", recipeSchema);
module.exports = Recipes;
