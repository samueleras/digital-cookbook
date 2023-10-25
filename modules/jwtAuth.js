const jwt = require('jsonwebtoken');
const jwtEncryptionKey = require('./jwtEncryptionKey.js');

module.exports = (req, res, next) => {

    try {
        const token = req.cookies.token;
        const user = jwt.verify(token, jwtEncryptionKey);
        req.user = user;
        next();
    } catch {
        res.clearCookie("token");
        res.redirect("/login");
    }

}