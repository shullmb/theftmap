const express = require('express');
const router = express.Router();

// GET login - send login form
router.get('/login', (req,res) => {
    res.sendStatus(200);
})

// GET signup - send signup form
router.get('/signup', (req,res) => {
    res.sendStatus(200);
})

// POST login - redirect to map index
router.post('/login', (req,res) => {
    // post logic goes here
    res.send('ok')
})

// POST sign in - redirect to map new
router.post('/signup', (req,res) => {
    // post logic goes here
    res.send('ok');
})

module.exports = router;