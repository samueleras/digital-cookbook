const jwt = require('jsonwebtoken');
const jwtEncryptionKey = require('./jwtEncryptionKey.js');
const User = require('./models/user')

module.exports = async (req, res, next) => {

    try {
        const token = req.cookies.token;
        const userFromToken = jwt.verify(token, jwtEncryptionKey);       
        const user = await User.findById(userFromToken.userid);
        req.user = { userid: user._id, username: user.username, saved_recipes: user.saved_recipes};
        next();
    } catch {
        res.clearCookie("token");
/*         res.redirect("/login"); */
    }

}