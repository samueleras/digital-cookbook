"use strict";

const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user')
const Recipe = require('./models/recipe')
const jwt = require('jsonwebtoken');
const jwtEncryptionKey = require('./jwtEncryptionKey.js');
const jwtAuth = require('./jwtAuth.js');

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

    Recipe.find().sort({ createdAt: -1 })
        .then((recipes) => {
            User.find()
                .then((users) => {
                    res.render('index', { title: 'Home', filename: 'home', style: 'yes', js: 'no', recipes, users });
                })
                .catch((err) => { console.log(err) });
        })
        .catch((err) => { console.log(err) });

});

app.get('/recipe/:id', (req, res) => {

    const id = req.params.id;
    Recipe.findById(id)
        .then((recipe) => {
            User.find()
                .then((users) => {
                    res.render('recipe', { title: 'Recipe', filename: 'recipe', style: 'none', js: 'no', recipe, users });
                })
                .catch((err) => { console.log(err) });
        })
        .catch((err) => { res.status(404).render('404', { title: 'Error - 404', filename: '404', style: 'no', js: 'no' }) });
});

// informatin of how the site works
app.get('/about', (req, res) => {
    res.render('about', { title: 'About', filename: 'about', style: 'no', js: 'no' });
});

// login
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login/SignUp', filename: 'login', style: 'yes', js: 'no' });
});

// login action
app.post('/login-submit', async (req, res) => {

    const { username, password } = req.body;

    let user = "";

    try {
        const users = await User.find({ username: username });

        /*         if(typeof users[0] != 'undefined'){ */
        user = { userid: users[0]._id, username: users[0].username, password: users[0].password };
        /*         } */
        if (user.password !== password) {
            res.redirect('/login');
        }

        delete user.password;

        const token = jwt.sign(user, jwtEncryptionKey, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true
        });

        res.redirect("/my-recipes");

    }
    catch (err) {
        console.log(err);
        res.redirect('/login');
    }

});

// signup
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'SignUp', filename: 'singup', style: 'yes', js: 'no' });
});

// sinup action
app.post('/signup-submit', async (req, res) => {

    const { username, password } = req.body;

    //Check if Username is already in use ...

    const user = new User({
        username: username,
        password: password
    });
    user.save()
        .then((result) => {
            console.log('user saved');
            res.redirect("/my-recipes");
        })
        .catch((err) => console.log(err));

});


// create a new recipes (only for logged in users)
app.get('/create', jwtAuth, (req, res) => {
    console.log(req.user.userid);
    res.render('create', { title: 'Create Recipe', filename: 'create', style: 'no', js: 'no' });

});

app.post('/create-submit', async (req, res) => {



    /*     const recipe = new Recipe({
            created_by: req.user.userid,
            name: "Bolognese",
            image_link: "./recipe_images/default.jpg",
            author_rating: 4,
            difficulty: "easy",
            preparation_time: 10,
            full_recipe: "Nudeln Kochen ... "
        });
        recipe.save()
            .then((result) => {
                console.log('recipe saved');
            })
            .catch((err) => console.log(err)); */

});

// list own recipes (only for logged in users)
app.get('/my-recipes', jwtAuth, (req, res) => {

    //Change this to variable users...
    Recipe.find({ created_by: req.user.userid })
        .then((recipes) => {
            res.render('my-recipes', { title: 'My Recipes', filename: 'my-recipes', style: 'no', js: 'no', recipes });
        })
        .catch((err) => { res.status(404).render('404', { title: 'Error - 404', filename: '404', style: 'no', js: 'no' }) });


});

// list recipes of other people that you saved/liked
/* app.get('/saved', (req, res) => {
    res.render('saved', { title: 'Saved Recipes', filename: 'saved', style: 'none', js: 'none' });
}); */

// errorpage
app.use((req, res) => {
    res.status(404).render('404', { title: 'Error - 404', filename: '404', style: 'no', js: 'no' });
});