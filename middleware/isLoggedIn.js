module.exports = (req, res, next) => {
    if (!req.user) {
        req.flash('You must be logged in to use these features');
        res.redirect('/auth/login');
    } else {
        next();
    }
}