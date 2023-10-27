const jwt = require('jsonwebtoken');
const jwtEncryptionKey = require('./jwtEncryptionKey.js');
const User = require('../DBmodels/user')

module.exports = (req, res, next) => {

    try {
        const token = req.cookies.token;
        const userFromToken = jwt.verify(token, jwtEncryptionKey);     
        User.findById(userFromToken.userid).then((user) => {
            req.user = { userid: user._id, username: user.username, saved_recipes: user.saved_recipes};
            next();
        }).catch((err) => console.log(err));
    } catch {
        res.clearCookie("token");
        next();
    }

}