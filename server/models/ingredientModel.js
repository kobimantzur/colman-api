const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * This schema defines how the recipe will look like in the database
 * userId will be the user that posted this recipe and comments will be every comment
 * a user post on it
 */
const ingredientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
    },
});

const Ingredients = mongoose.model('Ingredients', ingredientSchema);
module.exports = Ingredients;