const express = require('express');
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();

// TO DO: ADD isLoggedIn as middleware for all routes

// GET /maps
router.get('/', (req,res) => {
    res.render('maps/index');
})

// GET /maps
router.get('/new', (req,res) => {
    res.render('maps/new');
})

// POST /maps - post map specs to db
router.post('/', (req,res) => {
    db.map.create({
        // object params
    }).then( (map) => {
        req.flash('Map Saved!')
        res.redirect('/maps');
    }).catch( (error) => {
        req.flash('error', error.message);
        res.redirect('/maps/new');
    }) 
})

// GET /maps/:id - show a specific map
router.get('/maps/:id', (req,res) => {
    db.map.findById(req.params.id).then((map) => {
        res.render('/maps/show', {map});
    }).catch( (error) => {
        req.flash('error', error.message),
        res.render('404');
    })
})

router.delete('/maps/:id', (req,res) => {
    db.map.delete({
        where: {id: req.params.id}
    }).then( (data) => {
        console.log(data);
        req.flash('success', 'Map deleted');
        res.render('/maps');
    }).catch( (error) => {
        req.flash('error', `${error.message}. Please try again`);
        res.render('/maps/edit');
    })
})

module.exports = router;