"use strict";

const express = require('express');
const mongoose = require('mongoose');
const User = require('./DBmodels/user')
const Recipe = require('./DBmodels/recipe')
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const jwtEncryptionKey = require('./modules/jwtEncryptionKey.js');
const jwtAuth = require('./modules/jwtAuth.js');
const checkLogin = require('./modules/checkLogin.js');
const bodyParser = require('body-parser');
const { createHash } = require('crypto');
const fileUpload = require('express-fileupload');
const { v4: uuid } = require('uuid');
const fs = require('fs');

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
app.use(jwtAuth);

// home page for everyone to see, with everyones recipes
app.get('/', (req, res) => {
    Recipe.find().sort({ createdAt: -1 }).then((recipes) => {
        User.find().then((users) => {
            res.render('display-recipes', { title: 'All Recipes', defaultstyle: 'yes', stylefile: 'display-recipes', jsfile: 'no', recipes, users, currentUser: req.user ??= undefined });
        }).catch((err) => { console.log(err) });
    }).catch((err) => { console.log(err) });
});

// display recipe by id
app.get('/recipe/display/:id', (req, res) => {
    const id = req.params.id;
    Recipe.findById(id).then((recipe) => {
        User.find().then((users) => {
            res.render('display-recipe', { title: 'Recipe', defaultstyle: 'yes', stylefile: 'display-recipe', jsfile: 'no', recipe, users, currentUser: req.user ??= undefined });
        }).catch((err) => { console.log(err) });
    }).catch((err) => { res.status(404).render('404', { title: 'Error - 404', defaultstyle: 'yes', stylefile: 'no', jsfile: 'no', currentUser: req.user ??= undefined }) });
});

// informatin of how the site works
app.get('/about', (req, res) => {
    res.render('about', { title: 'About', defaultstyle: 'yes', stylefile: 'about', jsfile: 'no', currentUser: req.user ??= undefined });
});

// login
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login/SignUp', defaultstyle: 'yes', stylefile: 'login-signup', jsfile: 'login' });
});

// login action
app.post('/login-submit', async (req, res) => {
    const { username, password } = req.body;
    let hashed_password = createHash('sha256').update(password).digest('hex');

    try {
        const users = await User.find({ username: username });

        if (users[0].password !== hashed_password) {
            throw new Error("On login: Password is wrong!")
        } else {
            console.log("Login successful")
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

// logout action
app.get('/logout', checkLogin, async (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

// signup
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'SignUp', defaultstyle: 'yes', stylefile: 'login-signup', jsfile: 'signup', currentUser: req.user ??= undefined });
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
            user.save().then((result) => {
                console.log('New user saved to DB');
            }).catch((err) => console.log(err));
        }
        res.send(response);
    }
    catch (err) {
        console.log(err);
        res.send(response);
    }

});

// create a new recipes (only for logged in users)
app.get('/recipe/create', checkLogin, (req, res) => {
    res.render('create-or-edit-recipe', { title: 'Create Recipe', defaultstyle: 'yes', stylefile: 'create-edit', jsfile: 'no', currentUser: req.user ??= undefined, edit_create: 'Create' });
});

// edit a recipes (only for logged in users)
app.get('/recipe/edit/:id', checkLogin, async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id);
        res.render('create-or-edit-recipe', { title: 'Edit Recipe', defaultstyle: 'yes', stylefile: 'create-edit', jsfile: 'no', currentUser: req.user ??= undefined, edit_create: 'Edit', recipe });
    } catch (err) {
        console.log("Failed to edit recipe: " + err);
    }
});

// submit created recipe
app.post('/create-edit-submit', checkLogin, async (req, res) => {

    const { mode, name, author_rating, difficulty, preparation_time, full_recipe } = req.body;

    let default_image_link = "/recipe_images/default.jpg";
    let image_link = default_image_link;
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

    let recipe;

    if (mode === 'create') {
        recipe = new Recipe({
            created_by: req.user.userid,
            name: name,
            image_link: image_link,
            difficulty: difficulty,
            preparation_time: preparation_time,
            full_recipe: full_recipe
        });
    } else {
        try {
            recipe = await Recipe.findById(mode);
            recipe.name = name;
            if (image_link != default_image_link) {
                recipe.image_link = image_link;
            }
            recipe.difficulty = difficulty;
            recipe.preparation_time = preparation_time;
            recipe.full_recipe = full_recipe;
        } catch (err) {
            console.log("Failed to find recipe for edit: " + err);
        }
    }
    recipe.save().then((result) => {
        console.log('recipe saved/edited');
        res.redirect(`recipe/display/${result._id}`);
    }).catch((err) => console.log(err));
});

// list own recipes (only for logged in users)
app.get('/my-recipes', checkLogin, (req, res) => {
    Recipe.find({ created_by: req.user.userid }).then((recipes) => {
        res.render('display-recipes', { title: 'My Recipes', defaultstyle: 'yes', stylefile: 'display-recipes', jsfile: 'no', recipes, currentUser: req.user ??= undefined });
    }).catch((err) => { res.status(404).render('404', { title: 'Error - 404', defaultstyle: 'yes', stylefile: 'no', jsfile: 'no', currentUser: req.user ??= undefined }) });
});

// delete a recipe
app.get('/recipe/delete/:id', checkLogin, async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id);
        if (recipe.image_link != "/recipe_images/default.jpg") {
            let absolute_image_link = __dirname + "/public" + recipe.image_link;
            if (fs.existsSync(absolute_image_link)) {
                fs.unlink(absolute_image_link, (err) => console.log(err));
            }
        }
        await Recipe.findByIdAndDelete(req.params.id);
        console.log("Deleted recipe with id: " + req.params.id)
    } catch (err) {
        console.log("Failed deleting recipe: " + err);
    }
    res.redirect("/my-recipes");         //später link redirect preventen und ggf per javascript diese gethandler aufrufen und auf DELETE umstellen anstatt GET
});

// save a recipe
app.get('/recipe/save/:id', checkLogin, async (req, res) => {
    let user = await User.findById(req.user.userid);
    user.saved_recipes.push(req.params.id);
    user.save().then((result) => {
        console.log('Recipe saved for user ' + req.user.username);
        res.redirect("/saved-recipes");         //später link redirect preventen und ggf per javascript diese gethandler aufrufen
    }).catch((err) => console.log(err));
});

// unsave a recipe
app.get('/recipe/unsave/:id', checkLogin, async (req, res) => {
    let user = await User.findById(req.user.userid);
    user.saved_recipes.splice(user.saved_recipes.indexOf(req.params.id), 1);
    user.save().then((result) => {
        console.log('Recipe ' + req.params.id + ' unsaved for user ' + req.user.username);
        res.redirect("/saved-recipes");
    }).catch((err) => console.log('Failed saving recipe for user ' + err)); //später link redirect preventen und ggf per javascript diese gethandler aufrufen

});

// list recipes of other people that you saved/liked
app.get('/saved-recipes', checkLogin, (req, res) => {
    Recipe.find({ '_id': { $in: req.user.saved_recipes } }).then((recipes) => {
        User.find().then((users) => {
            res.render('display-recipes', { title: 'Saved Recipes', defaultstyle: 'yes', stylefile: 'display-recipes', jsfile: 'no', recipes, users, currentUser: req.user ??= undefined });
        }).catch((err) => { console.log(err) });
    }).catch((err) => { res.status(404).render('404', { title: 'Error - 404', defaultstyle: 'yes', stylefile: 'no', jsfile: 'no', currentUser: req.user ??= undefined }) });
});

// rate a recipe
app.post('/recipe/rate', checkLogin, async (req, res) => {
    const { rating, id } = req.body;
    let recipe = await Recipe.findById(id);
    // check if there already is rating written by this user and delete if so
    for(let rating of recipe.ratings){
        if(rating.userid.toString() == req.user.userid.toString()){
            let position = recipe.ratings.indexOf(rating);
            console.log(position);
            recipe.ratings.splice(position, 1);
        }
    }
    recipe.ratings.push({ rating: rating, userid: req.user.userid});
    let ratingsum = 0;
    for( let rating of recipe.ratings){
        ratingsum += parseFloat(rating.rating);
    }
    recipe.rating = ratingsum / recipe.ratings.length;
    recipe.save().then((result) => {
        console.log('Recipe rating saved');
        res.redirect(`/recipe/display/${result._id}`);
    }).catch((err) => console.log(err));
});

// errorpage
app.use((req, res) => {
    res.status(404).render('404', { title: 'Error - 404', defaultstyle: 'yes', stylefile: '404', jsfile: 'no', currentUser: req.user ??= undefined });
});


//TODO
//Style About, little content update
//Content + Style footer
//Adjust css for fileupload. Not recognizable wether a file was uploaded or not. frontend js...
//Upload mov aswell? Is png uploadable?
//delete, save and create/edit send per frontend js, no page reload!
//Adjust css and js filenames lowercase
//List only 20 or 30 recipes per page
//Scale down, compress images
//Make final Styling
//Adjust about page, maybe with Images
//Adjust readme file