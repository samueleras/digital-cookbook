"use strict";

const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user')
const Recipe = require('./models/recipe')
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const jwtEncryptionKey = require('./jwtEncryptionKey.js');
const jwtAuth = require('./jwtAuth.js');
const bodyParser = require('body-parser')

// express app
const app = express();

// connect to MongoDb
const dbURI = require('./mongoDbLogin.js');
mongoose.connect(dbURI)
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// create application/json parser
const jsonParser = bodyParser.json();

// listen for requests on localhost:3000
app.listen(3000);

// static files
app.use(express.static('public'));

// Use cookieParser
app.use(cookieParser());

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
    res.render('login', { title: 'Login/SignUp', filename: 'login', style: 'yes', js: 'yes' });
});

// login action
app.post('/login-submit', jsonParser, async (req, res) => {

    const { username, password } = req.body;

    console.log(req.body)

    let user = "";

    try {
        const users = await User.find({ username: username });

        user = { userid: users[0]._id, username: users[0].username, password: users[0].password };

        if (user.password !== password) {
            res.end();
        } else {
            console.log("Login successful")

            delete user.password;

            const token = jwt.sign(user, jwtEncryptionKey, { expiresIn: "1h" });

            res.cookie("token", token, {
                httpOnly: true
            });
            res.redirect("/");      //Why does this redirect not work
        }

    }
    catch (err) {
        console.log(err);
        res.redirect('/login');
    }

});

// signup
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'SignUp', filename: 'signup', style: 'yes', js: 'yes' });
});

// signup action
app.post('/signup-submit', jsonParser, async (req, res) => {
    console.log(req.body);
    const { username, password, password2 } = req.body;
    let response = { user_available: false, password: "missing", password2: "missing", success: false };

    try {

        const users = await User.find({ username: username });

        console.log(username)

        // name check
        if (username != "" && typeof users[0] == 'undefined') {
            response.user_available = true;
        }

        console.log(response.user_available)

        // password check
        if (password === "") {
            response.password = "missing";
        } else if (password.length < 8) {
            response.password = "tooshort";
        }
        else {
            response.password = "ok";
        }

        if (password2 === "") {
            response.password2 = "missing";
        } else if (password !== password2) {
            response.password2 = "notmatching";
        }
        else {
            response.password2 = "ok";
        }

        console.log(response.password)
        console.log(response.password2)

        if (response.user_available && response.password == "ok" && response.password2 == "ok") {

            response.success = true;

            const user = new User({
                username: username,
                password: password
            });
            user.save()
                .then((result) => {
                    console.log('user saved');
                })
                .catch((err) => console.log(err));
        }

        console.log(response.success)

        res.send(response);
    }
    catch (err) {
        console.log(err);
        res.send(response);
    }

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