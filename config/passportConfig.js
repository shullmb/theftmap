const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

passport.serializeUser((user,cb) => {
    cb(null, user.id);
})

passport.deserializeUser((id,cb) => {
    db.user.findById(id).then( (user) => {
        cb(null, user);
    }).catch(cb);
})

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},(email,password,cb) => {
    db.user.find({
        where: {email: email}
    }).then((user) => {
        if (!user || !user.ValidPassword(password)) {
            cb(null, false);
        } else {
            cb(null, user);
        }
    }).catch(cb);
}))