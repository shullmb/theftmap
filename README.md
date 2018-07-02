# WDI Project 2 - Bike Theft Triangulation Map
### Objective 
##### To create a fullstack Node application using Express that pulls information about bike thefts and displays it graphically.
[THFTMPPR](ttps://thftmapper.herokuapp.com/)
![markers](/public/img/markers.png)

#### Requirements for this project include:
- [x] Have at least 2 models
- [x] Include sign up/log in functionality, with hashed passwords & an authorization flow
- [x] Incorporate at least one API
- [x] Have complete RESTful routes for at least one of your resources
- [x] Utilize an Sequelize
- [x] Include wireframes that you designed during the planning process

### Project Planning & Tracking
[Trello Board](https://trello.com/b/2pBLoWCO/wdi-project-2)

### Wireframes
Initial wireframes and prototyping of Mobile and Desktop views can be found here:
[Adobe XD Prototyping](https://xd.adobe.com/view/62c33da6-84f4-41d5-5e6e-0b4706678d63-14f2/)
___
### APIs
- [Bike Index API v3](https://bikeindex.org/documentation/api_v3)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/tutorial) 
___
### Resources and Libraries used
- NodeJS
- Express
- Google Maps JavaScript API (and Geocoding)
- async
- node-geocoder
- d3js
- lodash
- jQuery

for more information on packages used, please review package.json
___
### Models and Relations
Model | Schema | Relation
:------:|-----------|:----------:
user | name:string, email:string, password:string | `hasMany map`
map| location:string, lat:float, lng:float, radius:integer, title:string, description:text, public:boolean, userId:integer  | `belongsTo user` `belongsToMany bike`
bike| model:string, lat:float, lng:float, url:string | `belongsToMany map`
mapsBikes | mapId:integer, bikeId:integer | join table for map/bike M:M association

![ER Diagram](https://github.com/shullmb/readme_screenshots/blob/master/tm/er_diag.png?raw=true)


___
### Routes in use
|METHOD| ROUTE|
|:-----|:----:|
| GET   | `/` |
| GET   | `/auth/signup ` |
| GET   | `/auth/login  ` |
| POST  | `/auth/signup ` |
| POST  | `/auth/login  ` |
| GET   | `/auth/logout ` |
| GET   | `/maps` |
| GET   | `/maps/new` |
| POST  | `/maps` |
| GET   | `/maps/:id` |
| GET   | `/maps/:id/edit` |
| PUT   | `/maps/:id` |
| DELETE| `/maps/:id` |

___
### Challenges
#### Async 
The first major challenge that I ran into was need to call the Bike Index API a second time for each of the bikes to retrieve their latitude and longitude. 
The Bike Index API is structured to return different information through separate URIs. The first `request` call to Bike Index returns a list of bikes within the search area and lists the zipcode in which they were stolen. Using the id of each bike, I needed to make a second call. Unfortunately, this was not happening fast enough for JavaScript's singlethreaded nature. Further, `request` does not support Promises.
Per Steve's suggestion, I looked into using the `parallel` method of the async module. To make use of it, I dynamically mapped each of the bike ids from the first API call to an array of id-specific functions. Once mapped, `async.parallel` starts each of the functions in the array and returns an array with the results of a callback. 
```js
request(bikeIndexList, (err, response, body) => {
    let thefts = JSON.parse(body).bikes;
    // collect ids for second api call
    thefts.forEach((theft) => {
        theftIds.push(theft.id);
    })

    // map theftIds to individual functions for request
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

    // use async to return an array of bike objects to create entries in db
    async.parallel(async.reflectAll(individualBikeRequests), (err, results) => {
        // lodash method to return any falsey values
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
```
#### Data incompatibility
The second big challenge I ran into was using d3js to calculated the bounds of my Delaunay Triangles and Voronoi Polygons and Google Maps to draw them. After some research into the docs for lodash, d3 and google maps, I found my answers. Using a handful of arrays (probably more than I really neeeded) and lodash, I was able to coerce the data to take advantage of d3's poweful calculations and fit the output Google Maps's formatting requirements in just a few short lines.
##### Example:
```js
// calculate and coerce d3 data to work with google maps
function calculateDelaunayTriangles() {
    // lodash helpers to flatten all triangle arrays into single lat or lng vals => chunk into lat/lng pairs
    let polyCoords = _.chunk(_.flattenDeep(voronoi.triangles(bikeVoronoiData)), 2);
    let coordObjects = [];

    // create lat/lng obj literals for google maps
    polyCoords.forEach((coord) => {
        let coordObj = { lat: coord[0], lng: coord[1] };
        coordObjects.push(coordObj);
    });

    // split back into arrays of 3 pts for google maps
    mapsTriangles = _.chunk(coordObjects, 3);
}
```
#### Unix Timestamps
Currently, my application does not support filtering and searching within date ranges as my initial plan included. The Bike Index API stores the date and time of a theft as a UTC Unix timestamp. Sequelize and Postgres do not support this format. As I understand it, unix timestamp represents a fixed point in time (milliseconds since the epoch - 1/1/79). As this application has been designed for use all over North America, I would need to build in support to translate the unix timestamp for the local timezone wherever the bike theft occurred. I began researching a good way to handle this and it looks like I can use MomentTZ in a future release to add this functionality. However, tackling it was slightly out of scope at this time.
___
### Known Issues
#### Empty Search Area
When a search area returns no stolen bike data, the app has crashed on occasion. When reloaded, an empty map will exist in the users map index. I am devising a method to handle these situations more gracefully.
#### node-geocoder Error
Very rarely, a map will be created with no latitude and longitude stored in the db. The map still loads normally, but will lack the grey center pin. I will be adding validation to reject the creation of a map with where this error has occurred.
#### Can't set Headers after they are sent
Server side console will occasionally log a series of `Unhandled rejection Error: Can't set headers after they are sent.` errors. This does not crash the app and by all means appears to have no effect on functionality. Based on the number of times this error is thrown when it occurs, I believe it may have something to do with the `async.parallel` call made to the Bike Index API for details on each of the bikes returned with the initial call. I am still working to find where this unhandled error is located to patch it up.
#### Public feed
I attempted to set up a public feed so that users can make maps of their choice viewable by the public. I ran into issues writing middleware to handle permissions. This functionality is in the works.

___
### Future Releases
- [ ] further cleanup of styling
- [ ] public feed once middleware debugged
- [ ] support for date filter using MomentTZ.js 
- [ ] Integrate COORD Bike-share API to find bike rentals on your route
- [ ] possible switch to another map api or d3-geo
- [ ] Visualization calculations take water features into account
- [ ] Manhattan distance to take road/city blocks into account
- [ ] Strava Passport strategy
- [ ] User Profile - update info, password etc.

---
### Gratitude
Special thank-yous to:
- WDI Seattle 19 
- [@sixhops](https://github.com/sixhops) && [@kyleavb](https://github.com/kyleavb) for guidance
- 404 image - [unsplash - Lance Grandahl @lg17](https://unsplash.com/photos/-0D1nNY8pOU)





