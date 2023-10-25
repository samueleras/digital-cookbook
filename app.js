"use strict";

const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user')
const Recipe = require('./models/recipe')
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const jwtEncryptionKey = require('./modules/jwtEncryptionKey.js');
const jwtAuth = require('./modules/jwtAuth.js');
const bodyParser = require('body-parser');
const { createHash } = require('crypto');




// express app
const app = express();

// connect to MongoDb
const dbURI = require('./modules/mongoDbLogin.js');
mongoose.connect(dbURI)
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// create application/json parser
/* const jsonParser = bodyParser.json(); */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
app.post('/login-submit', /* jsonParser, */ async (req, res) => {

    const { username, password } = req.body;

    let hashed_password = createHash('sha256').update(password).digest('hex');

    try {
        const users = await User.find({ username: username });

        let user = { userid: users[0]._id, username: users[0].username, password: users[0].password };

        if (user.password !== hashed_password) {
            throw new Error("On login: Password is wrong!")
        } else {
            console.log("Login successful")
            delete user.password;
            const token = jwt.sign(user, jwtEncryptionKey, { expiresIn: "1h" });
            res.cookie("token", token, {
                httpOnly: true
            });
            res.send({ success: true });
        }
    }
    catch (err) {
        console.log(err);
        res.send({ success: false });
    }
});

// signup
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'SignUp', filename: 'signup', style: 'yes', js: 'yes' });
});

// signup action
app.post('/signup-submit', /* jsonParser, */ async (req, res) => {

    const { username, password, password2 } = req.body;
    let response = { user_available: false, password: "missing", password2: "missing", success: false };

    try {
        // Search for user in DB
        const users = await User.find({ username: username });

        // check if username is available
        if (username != "" && typeof users[0] == 'undefined') {
            response.user_available = true;
        }

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

        if (response.user_available && response.password == "ok" && response.password2 == "ok") {

            response.success = true;
            let hashed_password = createHash('sha256').update(password).digest('hex');

            const user = new User({
                username: username,
                password: hashed_password
            });
            user.save()
                .then((result) => {
                    console.log('New user saved to DB');
                })
                .catch((err) => console.log(err));
        }
        res.send(response);
    }
    catch (err) {
        console.log(err);
        res.send(response);
    }

});


// create a new recipes (only for logged in users)
app.get('/create', jwtAuth, (req, res) => {
    res.render('create', { title: 'Create Recipe', filename: 'create', style: 'no', js: 'no' });
});

app.post('/create-submit', jwtAuth, async (req, res) => {

    console.log(req.body);


    const { name, image_link, author_rating, difficulty, preparation_time, full_recipe } = req.body;

        const recipe = new Recipe({
            created_by: req.user.userid,
            name: name,
            image_link: "/recipe_images/default.jpg",
            author_rating: author_rating,
            difficulty: difficulty,
            preparation_time: preparation_time,
            full_recipe: full_recipe
        });
        recipe.save()
            .then((result) => {
                console.log('recipe saved');
                res.redirect(`recipe/${result._id}`);
            })
            .catch((err) => console.log(err));


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