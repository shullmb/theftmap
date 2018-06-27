const express = require('express');
const request = require('request');
const async = require('async');
const rp = require('request-promise');
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
    // TO DO: add variables back into the bikeIndexList uri
    // TO DO: trouble shoot res.send
    var bikeIndexRequest = function (theftId) {
        let bikeIndexUri = `https://bikeindex.org:443/api/v3/bikes/${theftId}`;
        return async.reflect(function () {
            request(bikeIndexUri, function (error, response, body) {
                console.log("\x1b[41m%s\x1b[0m", "This shit actually fired");
                let stolenRecord = JSON.parse(body).bike.stolen_record;
                if (stolenRecord.latitude !== null && stolenRecord.longitude !== null) {
                    let location = { lat: stolenRecord.latitude, lng: stolenRecord.longitude };
                    console.log("\x1b[3m%s\x1b[0m", JSON.stringify(location));
                    theftLocations.push(location);
                    console.log(theftLocations);
                }
            })
        })
    }
    let theftIds = [];
    let theftLocations = [];
    let bikeIndexList = `https://bikeindex.org:443/api/v3/search?page=1&per_page=25&location=98102&distance=10&stolenness=stolen`;

    request(bikeIndexList, (err, response, body) => {
        let thefts = JSON.parse(body).bikes;
        thefts.forEach((theft) => {
            theftIds.push(bikeIndexRequest(theft.id));
        })
        async.parallel(theftIds, (err,results) => {
            console.log(err);
            console.log("\x1b[3m%s\x1b[0m", "WE ARE IN THE FINAL CALLBACK")
            console.log("\x1b[3m%s\x1b[0m", results)
            res.send(theftLocations)
        })

    })

})
    // let theftLocations = [];
    // let bikeIndexListOptions = {
    //     uri: `https://bikeindex.org:443/api/v3/search?page=1&per_page=10&location=${req.body.zip}&distance=${req.body.searchRadius}&stolenness=stolen`,
    //     json: true
    // };
    
    // rp(bikeIndexListOptions).then( (body) => {
    //     body.bikes.forEach((theft) => {
    //         let bikeIndexBike = `https://bikeindex.org:443/api/v3/bikes/${theft.id}`

    //         rp(bikeIndexBike, (err,response,body) => {
    //             let stolenRecord = JSON.parse(body).bike.stolen_record;
    //             if (stolenRecord.latitude !== null && stolenRecord.longitude !== null) {
    //                 let location = { lat: stolenRecord.latitude, lng: stolenRecord.longitude };
    //                 theftLocations.push(location);
    //                 console.log(theftLocations);
    //             }
    //         })
    //     })
        
    // }).then( () => {
    //     res.send(theftLocations);
    // }).catch((error) => {
    //     console.log("\x1b[41m%s\x1b[0m", error);
    // })
    // res.render('maps/show',{key: process.env.MAPS_KEY});
    // db.map.findById(req.params.id).then((map) => {
    //     res.render('/maps/show', {map});
    // }).catch( (error) => {
    //     req.flash('error', error.message),
    //     res.render('404');
    // })
//})

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