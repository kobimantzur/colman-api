const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * This schema defines how the recipe will look like in the database
 * userId will be the user that posted this recipe and comments will be every comment
 * a user post on it
 */
const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        unique: true,
    },
    dateCreated: { type: Date, default: Date.now },
});

const Comments = mongoose.model('Comments', commentSchema);
module.exports = Comments;