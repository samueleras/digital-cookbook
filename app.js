"use strict";

const express = require('express');

// express app
const app = express();

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
    res.render('index', { title: 'Home', filename: 'home' });
});

// informatin of how the site works
app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// login
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login/SignUp' });
});

// create a new recipes (only for logged in users)
app.get('/create', (req, res) => {
    res.render('create', { title: 'Create Recipe' });
});

// list own recipes (only for logged in users)
app.get('/my-recipes', (req, res) => {
    res.render('my-recipes', { title: 'My Recipes' });
});

// list recipes of other people that you saved/liked
/* app.get('/saved', (req, res) => {
    res.render('saved', { title: 'Saved Recipes' });
}); */

// errorpage
app.use((req, res) => {
    res.status(404).render('404', { title: 'Error - 404' });
});