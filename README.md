# WDI Project 2 - Bike Theft Triangulation Map

### Objective 
Pull information about stolen bikes in your proximity to create a  Voronoi / Delaunay Projection overlay of map.

### Project Planning & Tracking
[Trello Board](https://trello.com/b/2pBLoWCO/wdi-project-2)

### Wireframes
[Adobe XD Prototyping](https://xd.adobe.com/view/71624733-4c11-4238-5975-802067b82b81-0753/)

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
user | name:string, email:string, password:string | hasOne collection
collection | | hasMany map
map| lat:float, lng:float, zoom:index | hasMany bike
bike| lat:float, lng:float, | belongsTo map

___
### Bike Index Query Params
- location <- accepts ip, zip, street address & lat/lng
- stolenness - all || proximity
- distance 

___
### Gratitude





