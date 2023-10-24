"use strict";

const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user')
const Recipe = require('./models/recipe')

// express app
const app = express();

// connect to MongoDb
const dbURI = require('./mongoDbLogin.js');
mongoose.connect(dbURI)
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// listen for requests on localhost:3000
app.listen(3000);

// static files
app.use(express.static('public'));

// Is there middleware for Sessions? Get user id ??

// auth-middleware to check if user is logged in
/* app.use( () => {
    auth
}); */

// home page for everyone to see, with everyones recipes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home', filename: 'home', style: 'yes', js: 'none' });
});

// informatin of how the site works
app.get('/about', (req, res) => {
    res.render('about', { title: 'About', filename: 'about', style: 'none', js: 'none' });
});

// login
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login/SignUp', filename: 'login', style: 'yes', js: 'none' });
});

// create a new recipes (only for logged in users)
app.get('/create', (req, res) => {
    res.render('create', { title: 'Create Recipe', filename: 'create', style: 'none', js: 'none' });
/*     const user = new User({
        username: "samueltest",
        password: "12345678"
    });
    user.save()
        .then((result) => {
            console.log('user saved');
        })
        .catch((err) => console.log(err));
}); */
    const recipe = new Recipe({
        created_by: "6537b7418956294e4a7b3cc2",
        name: "Gnocchi mit Gorgonzolasoße",
        image_link: "./recipe-images/default.jpg",
        author_rating: 5,
        difficulty: "medium",
        preparation_time: 20,
        full_recipe: "Zuerst Eier aufschlagen ... /n test /n dann das machen ... "
    });
    recipe.save()
        .then((result) => {
            console.log('user saved');
        })
        .catch((err) => console.log(err));
}); 

// list own recipes (only for logged in users)
app.get('/my-recipes', (req, res) => {
    res.render('my-recipes', { title: 'My Recipes', filename: 'my-recipes', style: 'none', js: 'none' });
});

// list recipes of other people that you saved/liked
/* app.get('/saved', (req, res) => {
    res.render('saved', { title: 'Saved Recipes', filename: 'saved', style: 'none', js: 'none' });
}); */

// errorpage
app.use((req, res) => {
    res.status(404).render('404', { title: 'Error - 404', filename: '404', style: 'none', js: 'none' });
});