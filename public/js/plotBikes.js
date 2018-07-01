var bikeLatLngs = [];
var bikeVoronoiData = [];
var markers = [];
const dataState = {markers: true, heatmap: false, delaunay: false, voronoi: false}
var voronoi = d3.voronoi();
var heatmap;
var centerMarker;

function initMap() {

    let searchCenter = new google.maps.LatLng(locationMap.lat,locationMap.lng);
    
    map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: searchCenter,
            styles: thftMapStyle,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
        }
    );

    // drop pin for center
    centerMarker = new google.maps.Marker({ position: searchCenter, map, icon: greyPin})
    
    bounds = new google.maps.LatLngBounds();
    
    bikes.forEach((bike) => {
        // collect for d3 visualization
        bikeVoronoiData.push([bike.lat,bike.lng])
        
        // collect for google visualization
        let latLng = new google.maps.LatLng(bike.lat,bike.lng);
        bikeLatLngs.push(latLng);

        // drop pins for each bike and adjust map bounds to fit data
        let mrk = new google.maps.Marker({ position: latLng, map: map, icon: doPin });
        bounds.extend(latLng);
        map.fitBounds(bounds);

        // info bubbles for each bike
        mrk.addListener('click', function () {
            let info = new google.maps.InfoWindow({
                content: `<p><a href='${bike.url}' target='_blank'>${bike.model}</a></p>`
            });
            info.open(map, mrk);
        });

        markers.push(mrk);
    });
}

function geocodeAddress(geocoder, resultsMap) {
    var zip = document.getElementById('zip').value;
    geocoder.geocode({ 'address': zip }, function (results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            centerMarker.setPosition(results[0].geometry.location);
        } else {
            console.log('error: ' + status);
        }
    });
}

function toggleMarkers() {
    if (!dataState.markers) {
        markers.forEach( (marker) => {
            marker.setMap(map);
        })
        dataState.markers = true;
    } else {
        markers.forEach((marker) => {
            marker.setMap(null);
        })
        dataState.markers = false;
    }
}

function toggleHeatMap() {
    if (!dataState.heatmap) {
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: bikeLatLngs,
            radius: 50
        });    
        heatmap.setMap(map)
        dataState.heatmap = true;
    } else {
        heatmap.setMap(null);
        dataState.heatmap = false;
    }
}

function toggleDelaunayTriangles() {
    if (!dataState.delaunay) {
        dataState.delaunay = true;
        // calculate and coerce d3 data to work with google maps
        let polyCoords = _.chunk(_.flattenDeep(voronoi.triangles(bikeVoronoiData)), 2)
        let coordObjects = [];

        polyCoords.forEach((coord) => {
            let coordObj = { lat: coord[0], lng: coord[1] }
            coordObjects.push(coordObj);
        })

        let triangleCoords = _.chunk(coordObjects, 3);
    
        map.data.setStyle({ strokeColor: '#76ff03', fillColor: '#617C8A' })
        map.data.add({ geometry: new google.maps.Data.Polygon(triangleCoords) });
    } else {
        clearShapes();
        dataState.delaunay = false;
    }
}

function toggleVoronoiPolygons() {
    let polyArray = voronoi.polygons(bikeVoronoiData);
    let polygons = [];
    // coerce data to work with googlemaps
    polyArray.forEach((arr) => {
        let coordObjects = [];
        // stop short! last item in each polygon array is a data obj with center point that breaks everything
        for (i = 0; i < arr.length; i++) {
            // remove null/undefined
            arr = _.compact(arr);
            // create lat/lng literals for google maps paths
            let coordObj = { lat: arr[i][0], lng: arr[i][1] }
            coordObjects.push(coordObj);
        }
        polygons.push(coordObjects);
    })
    if (!dataState.voronoi) {
        // code to visualize voronoi polygons
        // console.log(voronoi.polygons(bikeVoronoiData));
        polygons.forEach( (polygon) => {
            let poly = new google.maps.Polygon({
                paths: polygon,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: '#FF0000',
                fillOpacity: 0.1
            });
            poly.setMap(map);
        })
        dataState.voronoi = true;        
    } else {
        polygons.forEach( (poly) => {
            poly.setMap(null);
        })
        dataState.voronoi = false;        
    }
}

function clearShapes() {
    map.data.forEach(function (dataPoint) {
        map.data.remove(dataPoint);
    });
}

// Make those button work!
document.getElementById('markers').addEventListener('click', toggleMarkers);
document.getElementById('heatmap').addEventListener('click', toggleHeatMap);
document.getElementById('delaunay').addEventListener('click', toggleDelaunayTriangles);
document.getElementById('voronoi').addEventListener('click', toggleVoronoiPolygons);
