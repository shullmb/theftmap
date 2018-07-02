# WDI Project 2 - Bike Theft Triangulation Map

### Objective 
To create a fullstack application that pulls information about bike thefts and displays it graphically.

### Project Planning & Tracking
[Trello Board](https://trello.com/b/2pBLoWCO/wdi-project-2)

### Wireframes
[Adobe XD Prototyping](https://xd.adobe.com/view/62c33da6-84f4-41d5-5e6e-0b4706678d63-14f2/)
___
### APIs
- Bike Index API
- Map API to be selected 
___
### Resources and Libraries used
- jQuery
- d3
- lodash
- Google Maps JavaScript API
___
### Models and Relations
Model | Schema | Relation
:------:|-----------|:----------:
user | name:string, email:string, password:string | hasMany maps
map| location:string, lat:float, lng:float, radius:integer, title:string, description:text,public:boolean, userId:integer  | belongsToMany bikes
bike| model:string, lat:float, lng:float, url:string | belongsToMany maps

___
### Routes
|METHOD| ROUTE|
|:-----|:-----:|
| GET   | /     |
| GET   | /auth/signup  |
| GET   | /auth/login   |
| POST  | /auth/signup  |
| POST  | /auth/login   |
| GET   | /auth/logout  |
| GET   | /maps |
| GET   | /maps/new |
| POST  | /maps |
| GET   | /maps/:id |
| GET   | /maps/:id/edit    |
| PUT   | /maps/:id |
| DELETE| /maps/:id |


___
### Bike Index Query Params
- location <- accepts ip, zip, street address & lat/lng
- stolenness - all || proximity
- distance 

___
### Challenges
- async
- unix UTC timestamps
- d3 => google maps
___
### Known Issues
- Empty Search Area
- Geocoder errors with no warning => lack of Lat Lng
- Can't set Headers after they are set

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
- WDI 19 
- @sixhops && @kyleavb for guidance
- 404 image - [unsplash - Lance Grandahl @lg17](https://unsplash.com/photos/-0D1nNY8pOU)





