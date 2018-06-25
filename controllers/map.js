const express = require('express');
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();

// GET /map 
router.get('/', isLoggedIn, (req,res) => {
    res.render('map/index');
})

module.exports = router;