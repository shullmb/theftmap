# WDI Project 2 - Bike Theft Triangulation Map

### Objective 
Pull information about stolen bikes in your proximity to create a  Data Visualization overlays of the map.

### Project Planning & Tracking
[Trello Board](https://trello.com/b/2pBLoWCO/wdi-project-2)

### Wireframes
[Adobe XD Prototyping](https://xd.adobe.com/view/62c33da6-84f4-41d5-5e6e-0b4706678d63-14f2/)

### APIs Needed
- Bike Index API
- Map API to be selected 

#### Options and npm packages for Map API
- geocoder
- node-geocoder
- osm
___
### Models and Relations
Model | Schema | Relation
:------:|-----------|:----------:
user | name:string, email:string, password:string | hasMany maps
map| location:string, lat:float, lng:float, radius:integer, title:string, description:text,public:boolean, userId:integer  | belongsToMany bikes
bike| model:string, lat:float, lng:float, url:string | belongsToMany maps

___
### Bike Index Query Params
- location <- accepts ip, zip, street address & lat/lng
- stolenness - all || proximity
- distance 

___
### Challenges
- async
- unix UTC timestamps
---
### Future Release
- support for date filter
- possible switch to another map api or d3-geo
---
### Gratitude
- WDI 19




