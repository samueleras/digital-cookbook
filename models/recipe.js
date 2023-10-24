const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    created_by: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image_link: {
        type: String,
        required: true
    },
    author_rating: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    preparation_time: {
        type: Number,
        required: true
    },
    full_recipe: {
        type: String,
        required: true
    },
    public_ratings: [{
        rating : Number,
        user_id : String
    }],
    public_rating: {
        type: String
    },
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;