const express = require('express');
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();

// GET /maps
router.get('/', isLoggedIn, (req,res) => {
    res.render('maps/index');
})

// GET /maps
router.get('/new', isLoggedIn, (req,res) => {
    res.render('maps/new');
})

module.exports = router;