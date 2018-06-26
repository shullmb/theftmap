const express = require('express');
const request = require('request');
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();

// TO DO: ADD isLoggedIn as middleware for all routes

// GET /maps
router.get('/', (req,res) => {
    res.render('maps/index', {extractScripts: true});
})

// GET /maps
router.get('/new', (req,res) => {
    res.render('maps/new', {key: process.env.MAPS_KEY});
})

// POST /maps - post map specs to db
router.post('/', (req,res) => {
    let bikeIndexList = `https://bikeindex.org:443/api/v3/search?page=1&per_page=25&location=${req.body.zip}&distance=${req.body.searchRadius}&stolenness=stolen`
    request(bikeIndexList, (err,response,body) => {
        let thefts = JSON.parse(body).bikes;
        res.send(thefts);
    })
    // db.map.create({
    //     // object params
    // }).then( (map) => {
    //     req.flash('Map Saved!')
    //     res.redirect('/maps');
    // }).catch( (error) => {
    //     req.flash('error', error.message);
    //     res.redirect('/maps/new');
    // }) 
})

// GET /maps/:id - show a specific map
router.get('/:id', (req,res) => {
    let bikeIndexList = `https://bikeindex.org:443/api/v3/search?page=1&per_page=25&location=${req.body.zip}&distance=${req.body.searchRadius}&stolenness=stolen`
    let theftLocations = [];
    request(bikeIndexList, (err, response, body) => {
        let thefts = JSON.parse(body).bikes;
        thefts.forEach( (theft) => {
            // console.log(theft);
        let bikeIndexBike = `https://bikeindex.org:443/api/v3/bikes/${theft.id}`
            request(bikeIndexBike, (err, response, body) => {
                let stolenRecord = JSON.parse(body).bike.stolen_record;
                console.log("\x1b[35m%s\x1b[0m", stolenRecord.latitude);
                if (stolenRecord.latitude != null && stolenRecord.longitude !== null) {
                    theftLocations.push({lat: stolenRecord.latitude, lng: stolenRecord.longitude})
                }
            })
        })
    }).done( () => {
        res.send(theftLocations);
    })
    // res.render('maps/show',{key: process.env.MAPS_KEY});
    // db.map.findById(req.params.id).then((map) => {
    //     res.render('/maps/show', {map});
    // }).catch( (error) => {
    //     req.flash('error', error.message),
    //     res.render('404');
    // })
})

router.delete('/:id', (req,res) => {
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