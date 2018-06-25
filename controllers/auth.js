const express = require('express');
const passport = require('../config/passportConfig');
const db = require('../models');
const router = express.Router();

// GET /auth/signup - send signup form
router.get('/signup', (req,res) => {
    res.render('auth/signup')
})

// GET /auth/login - send login form
router.get('/login', (req,res) => {
    res.render('auth/login')
})

// POST /auth/sign in - redirect to map new
router.post('/signup', (req,res) => {
    db.user.findOrCreate({
        where: {email: req.body.email},
        defaults: {
            name: req.body.name,
            password: req.body.password
        }
    }).spread( (user,created) => {
        if (created) {
            console.log("TRYING TO LOG IN AFTER SIGNUP");
            passport.authenticate('local', {
                successRedirect: '/maps/new',
                successFlash: 'Welcome to THFTMAPPER - Create your first map!'
            })(req,res);
        } else {
            req.flash('error', 'Sorry, this email address is already in use. Please try another.');
            res.redirect('/auth/signup');
        }
    }).catch( (error) => {
        console.log(error.message);
        req.flash('error', error.message);
        res.redirect('/auth/signup');
    })
})

// POST /auth/login - redirect to map index
router.post('/login', passport.authenticate('local',{
    successRedirect: '/maps',
    failureRedirect: '/auth/login',
    successFlash: 'Welcome to the show',
    failureFlash: 'Invalid credentials - please try again.'
}))

router.get('/logout', (req,res) => {
    req.logout();
    // req.flash('success', 'You have logged out');
    res.redirect('/');
})
module.exports = router;