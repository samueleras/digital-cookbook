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
    ratings: [{
        rating : Number,
        user_id : String
    }],
    rating: {
        type: String
    },
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;