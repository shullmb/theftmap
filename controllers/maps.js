const express = require('express');
const request = require('request');
const async = require('async');
const _ =require('lodash');
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const isCurrentUser = require('../middleware/isCurrentUser');
const router = express.Router();

// TO DO: ADD isLoggedIn as middleware for all routes

// GET /maps
router.get('/', isLoggedIn, (req,res) => {
    db.user.findById(req.user.id).then((user) => {
        user.getMaps().then((maps) => {
            res.render('maps/index', {maps});
        })
    })
})

// GET /maps
router.get('/new', isLoggedIn, (req,res) => {
    res.render('maps/new', {key: process.env.MAPS_KEY});
})

// POST /maps - post map specs to db
router.post('/', (req,res) => {
        // TO DO: add variables back into the bikeIndexList uri
    // TO DO: trouble shoot res.send
    console.log(req.body.location, req.body.radius);
    db.map.create({
        location: req.body.location,
        radius: req.body.radius,
        title: req.body.title,
        description: req.body.description,
        public: false,
        userId: req.user.id
    }).then( (map) => {
        let theftIds = [];
        let bikeIndexList = `https://bikeindex.org:443/api/v3/search?page=1&per_page=25&location=${encodeURI(map.location)}&distance=${map.radius}&stolenness=proximity`;
    
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
                    console.log(bike);
                    db.bike.findOrCreate({
                        where: {bikeIndexId: bike.value.bikeIndexId},
                        defaults: {
                            model: bike.value.model,
                            lat: bike.value.lat,
                            lng: bike.value.lng,
                            url: bike.value.url
                        }
                    }).spread((bike,created) => {
                        map.addBike(bike).then( ()=> {
                            req.flash('success', 'Map Saved!')
                            res.redirect(`/maps/${map.id}`);
                        })
                    })
                })
            })
        })
    }).catch((error) => {
        req.flash('error', error.message);
        res.redirect('/maps/new')
    })

})

// GET /maps/:id - show a specific map
router.get('/:id', isLoggedIn, isCurrentUser, (req,res) => {
    db.map.findById(req.params.id).then( (map) => {
        map.getBikes().then( (bikes) => {
            res.render('maps/show', {map,bikes, key: process.env.MAPS_KEY});
        })
    }).catch( (error) => {
        req.flash('error', `${error.message}. Please Try again.`);
        res.render('/maps/index');
    })
})

// GET /maps/:id/edit - edit a specific map
router.get('/:id/edit', isLoggedIn, isCurrentUser, (req,res) => {
    db.map.findById(req.params.id).then( (map) => {
        map.getBikes().then( (bikes) => {
            res.render('maps/edit', {map,bikes, key: process.env.MAPS_KEY});
        })
    }).catch( (error) => {
        req.flash('error', `${error.message}. Please Try again.`);
        res.render('/maps/index');
    })
})

// PUT /maps/:id
router.put('/:id', (req,res) => {
    db.map.update({
        title: req.body.title,
        description: req.body.description,
        public: req.body.public,
    },{where: {id: req.params.id}}).then( (data) => {
        res.sendStatus(200);
    }).catch( (error) => {
        req.flash('error', `${ error.message }.Please try again`)
    })
})

// DELETE /maps/:id
router.delete('/:id', (req,res) => {
    db.mapsBikes.destroy({
        where: {mapId: req.params.id}
    }).then( (data) => {
        db.map.destroy({
            where: {id: req.params.id}
        })
    }).then((data) => {
        req.flash
        res.sendStatus(200);
    }).catch((error) => {
        req.flash('error', `${error.message}. Please try again`);
        res.render('/maps/edit');
    })
})

module.exports = router;


