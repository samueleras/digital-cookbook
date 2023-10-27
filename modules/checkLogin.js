module.exports = (req, res, next) => {

    if (typeof req.user != 'undefined') {
        next();
    }
    else {
        res.redirect("/login");
    }

}