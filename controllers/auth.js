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

// POST login - 
router.post('/login', (req,res) => {
    res.sendStatus(200);
})

// POST login - 
router.post('/signup', (req,res) => {
    res.sendStatus(200);
})

module.exports = router;