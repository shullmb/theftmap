const express = require('express');
const router = express.Router();

// GET /auth/login - send login form
router.get('/login', (req,res) => {
    res.render('auth/login')
})

// GET /auth/signup - send signup form
router.get('/signup', (req,res) => {
    res.render('auth/signup')
})

// POST /auth/login - redirect to map index
router.post('/login', (req,res) => {
    // post logic goes here
    res.send('ok')
})

// POST /auth/sign in - redirect to map new
router.post('/signup', (req,res) => {
    // post logic goes here
    res.send('ok');
})

module.exports = router;