"use strict";

const express = require('express');

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// listen for requests on localhost:3000
app.listen(3000);


// home page for everyone to see, with everyones recipes
app.get('/', (req, res) => {
    res.sendFile('./views/home.html', { root: __dirname });
});

// informatin of how the site works
app.get('/about', (req, res) => {
    res.sendFile('./views/about.html', { root: __dirname });
});

// login
app.get('/login', (req, res) => {
    res.sendFile('./views/login.html', { root: __dirname });
});

// create a new recipes (only for logged in users)
app.get('/create', (req, res) => {
    res.sendFile('./views/create.html', { root: __dirname });
});

// list own recipes (only for logged in users)
app.get('/my-recipes', (req, res) => {
    res.sendFile('./views/my-recipes.html', { root: __dirname });
});

// list recipes of other people that you saved/liked
/* app.get('/saved', (req, res) => {
    res.sendFile('./views/saved.html', { root: __dirname });
}); */

// errorpage
app.use((req, res) => {
    res.sendFile('./views/404.html', { root: __dirname });
});