const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * This schema defines the categories for each recipe, for example "Italian"
 */
const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    dateCreated: { type: Date, default: Date.now },
});

const Categories = mongoose.model('Categories', categorySchema);
module.exports = Categories;