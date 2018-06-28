const express = require('express');
const request = require('request');
const async = require('async');
const _ =require('lodash');
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
    res.render('maps/new', {key: process.env.MAPS_KEY});
})

// POST /maps - post map specs to db
router.post('/', (req,res) => {
        // TO DO: add variables back into the bikeIndexList uri
    // TO DO: trouble shoot res.send
    db.map.create({
        location: req.body.location,
        radius: req.body.radius,
        userId: req.user.id
    }).then( (map) => {
        let theftIds = [];
        let bikeIndexList = `https://bikeindex.org:443/api/v3/search?page=1&per_page=25&location=${encodeURI(req.body.location)}&distance=${req.body.radius}&stolenness=proximity`;
    
        request(bikeIndexList, (err, response, body) => {
            let thefts = JSON.parse(body).bikes;
            thefts.forEach((theft) => {
                theftIds.push(theft.id);
            })
    
            let individualBikeRequests = theftIds.map(function (theftId) {
                let bikeIndexUri = `https://bikeindex.org:443/api/v3/bikes/${theftId}`;
                return function (cb) {
                    request(bikeIndexUri, function (error, response, body) {
                        let bike = JSON.parse(body).bike;
                        if (bike.stolen_record.latitude !== null && bike.stolen_record.longitude !== null) {
                            let bikeInfo = {
                                bikeIndexId: bike.id,
                                model: bike.title,
                                url: bike.url,
                                lat: bike.stolen_record.latitude,
                                lng: bike.stolen_record.longitude
                            }
                            cb(null, bikeInfo);
                        } else {
                            cb(null)
                        }
                    })
                }
            })
    
            async.parallel(async.reflectAll(individualBikeRequests), (err, results) => {
                let bikes = _.compact(results);
                bikes.forEach( (bike) => {
                    // find or create bike with same bikeIndexId
                    db.findOrCreate({
                        where: {bikeIndexId: bike.bikeIndexId}
                    }).spread((bike,created) => {
                        map.addBike(bike).then( ()=> {
                            req.flash('success', 'Map Saved!')
                            res.render('maps/show', { bikes: bikes, key: process.env.MAPS_KEY });
                        })
                    })
                })
            })
        })
    }).catch((error) => {
        req.flash('error', error.message);
        res.redirect('/maps/new')
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

    res.render('maps/show',{key: process.env.MAPS_KEY});
    db.map.findById(req.params.id).then((map) => {
        res.render('/maps/show', {map});
    }).catch( (error) => {
        req.flash('error', error.message),
        res.render('404');
    })
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