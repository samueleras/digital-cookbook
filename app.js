"use strict";

const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user')
const Recipe = require('./models/recipe')
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const jwtEncryptionKey = require('./modules/jwtEncryptionKey.js');
const jwtAuth = require('./modules/jwtAuth.js');
const checkLogin = require('./modules/checkLogin.js');
const bodyParser = require('body-parser');
const { createHash } = require('crypto');
const fileUpload = require('express-fileupload');
const { v4: uuid } = require('uuid');

// express app
const app = express();

// connect to MongoDb
const dbURI = require('./modules/mongoDbLogin.js');
mongoose.connect(dbURI)
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// listen for requests on localhost:3000
app.listen(3000);

// Use body parser for json or url
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static files
app.use(express.static('public'));

// Use cookieParser
app.use(cookieParser());

// Use the express-fileupload middleware
app.use(fileUpload());

// Check for userlogin
app.use(jwtAuth());

// home page for everyone to see, with everyones recipes
app.get('/', (req, res) => {

    Recipe.find().sort({ createdAt: -1 })
        .then((recipes) => {
            User.find()
                .then((users) => {
                    res.render('index', { title: 'Home', ejsfile: 'home', defaultstyle: 'yes', stylefile: 'homeStyle', jsfile: 'no', recipes, users });
                })
                .catch((err) => { console.log(err) });
        })
        .catch((err) => { console.log(err) });
});

// display recipe by id
app.get('/recipe/:id', (req, res) => {
    const id = req.params.id;
    Recipe.findById(id)
        .then((recipe) => {
            User.find()
                .then((users) => {
                    res.render('recipe', { title: 'Recipe', ejsfile: 'recipe', defaultstyle: 'yes', stylefile: 'no', jsfile: 'no', recipe, users });
                })
                .catch((err) => { console.log(err) });
        })
        .catch((err) => { res.status(404).render('404', { title: 'Error - 404', ejsfile: '404', defaultstyle: 'yes', stylefile: 'no', jsfile: 'no' }) });
});

// informatin of how the site works
app.get('/about', (req, res) => {
    res.render('about', { title: 'About', ejsfile: 'about', defaultstyle: 'yes', stylefile: 'no', jsfile: 'no'});
});

// login
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login/SignUp', ejsfile: 'login', defaultstyle: 'no', stylefile: 'loginStyle' , jsfile: 'yes' });
});

// login action
app.post('/login-submit', async (req, res) => {

    const { username, password } = req.body;

    let hashed_password = createHash('sha256').update(password).digest('hex');

    try {
        const users = await User.find({ username: username });

        /* let user = { userid: users[0]._id, username: users[0].username, password: users[0].password }; */

        if (/* user. */password !== hashed_password) {
            throw new Error("On login: Password is wrong!")
        } else {
            console.log("Login successful")
            /* delete user.password; */
            let user = { userid: users[0]._id, username: users[0].username, saved_recipes: users[0].saved_recipes };
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
    res.render('signup', { title: 'SignUp', ejsfile: 'signup', defaultstyle: 'no', stylefile: 'signupStyle' , jsfile: 'yes' });
});

// signup action
app.post('/signup-submit', async (req, res) => {

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
app.get('/create', checkLogin, (req, res) => {
    res.render('create', { title: 'Create Recipe', ejsfile: 'create', defaultstyle: 'no', stylefile: 'no', jsfile: 'no' });
});

// submit created recipe
app.post('/create-submit', checkLogin, async (req, res) => {

    const { name, author_rating, difficulty, preparation_time, full_recipe } = req.body;

    let image_link = "/recipe_images/default.jpg";;
    let image_name = uuid();

    try {
        const { image } = req.files;
        if (image && /^image/.test(image.mimetype)) {
            let fileExtension = "." + image.name.split('.').pop();
            image_link = '/recipe_images/uploaded' + image_name + fileExtension;
            let absolute_image_link = __dirname + "/public" + image_link;
            image.mv(absolute_image_link);
        }
    } catch (err) {
        console.log("No picture uploaded... using default");
    }

    const recipe = new Recipe({
        created_by: req.user.userid,
        name: name,
        image_link: image_link,
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
app.get('/my-recipes', checkLogin, (req, res) => {

    Recipe.find({ created_by: req.user.userid })
        .then((recipes) => {
            res.render('my-recipes', { title: 'My Recipes', ejsfile: 'my-recipes', defaultstyle: 'yes', style: 'no', jsfile: 'no', recipes });
        })
        .catch((err) => { res.status(404).render('404', { title: 'Error - 404', ejsfile: '404', defaultstyle: 'yes', stylefile: 'no', jsfile: 'no' }) });
});

// list recipes of other people that you saved/liked
app.get('/saved', checkLogin, (req, res) => {
    Recipe.find({ '_id': { $in: req.user.saved_recipes } })
        .then((recipes) => {
            res.render('saved', { title: 'Saved Recipes', ejsfile: 'saved-recipes', defaultstyle: 'yes', style: 'no', jsfile: 'none', recipes });
        })
        .catch((err) => { res.status(404).render('404', { title: 'Error - 404', ejsfile: '404', defaultstyle: 'yes', stylefile: 'no', jsfile: 'no' }) });
});

// errorpage
app.use((req, res) => {
    res.status(404).render('404', { title: 'Error - 404', ejsfile: '404', defaultstyle: 'yes', stylefile: 'no', jsfile: 'no' });
});