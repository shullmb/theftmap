const dataState = {markers: true, heatmap: false, delaunay: false, voronoi: false}
var bikeLatLngs = [];
var bikeVoronoiData = [];
var voronoi = d3.voronoi();
var markers = [];
var heatmap;
var mapsTriangles = []
var mapsPolys = [];
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
    calculateDelaunayTriangles();
    calculateVoronoiPolys();
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
        selectOverlay('#markers');
    } else {
        markers.forEach((marker) => {
            marker.setMap(null);
        })
        dataState.markers = false;
        deselectOverlay('#markers');
    }
}

function toggleHeatMap() {
    if (!dataState.heatmap) {
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: bikeLatLngs,
            radius: 40
        });    
        heatmap.setMap(map)
        dataState.heatmap = true;
        selectOverlay('#heatmap')
    } else {
        heatmap.setMap(null);
        dataState.heatmap = false;
        deselectOverlay('#heatmap')
    }
}

function toggleDelaunayTriangles() {
    if (!dataState.delaunay) {
        map.data.setStyle({ strokeColor: '#76ff03', fillColor: '#617C8A' })
        map.data.add({ geometry: new google.maps.Data.Polygon(mapsTriangles) });

        dataState.delaunay = true;
        selectOverlay('#delaunay')
    } else {
        clearShapes();
        dataState.delaunay = false;
        deselectOverlay('#delaunay')
    }
}

function toggleVoronoiPolygons() {
    console.log(dataState.voronoi,mapsPolys);
    if (!dataState.voronoi) {
        // draw polygons on map
        mapsPolys.forEach( (polygon) => {
            polygon.setMap(map);
        })
        
        dataState.voronoi = true;
        selectOverlay('#voronoi')
    } else {
        // clear polygons
        mapsPolys.forEach( (polygon) => {
            polygon.setMap(null);
        })

        dataState.voronoi = false;        
        deselectOverlay('#voronoi')
    }
}

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

// calculate and coerce data to work with googlemaps
function calculateVoronoiPolys() {
    let polyArray = voronoi.polygons(bikeVoronoiData);
    let polygons = [];
    // let mapsPolys = [];
    polyArray.forEach((arr) => {
        let coordObjects = [];
        // stop short! last item in each polygon array is a data obj with center point that breaks everything
        for (i = 0; i < arr.length; i++) {
            // remove null/undefined
            arr = _.compact(arr);
            // create lat/lng literals for google maps paths
            let coordObj = { lat: arr[i][0], lng: arr[i][1] };
            coordObjects.push(coordObj);
        }
        polygons.push(coordObjects);
    });
    // map lat/lng to google maps polygon objs
    mapsPolys = polygons.map((polygon) => {
        return new google.maps.Polygon({
            paths: polygon,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: '#617C8A',
            fillOpacity: 0.1
        });
    });
}

// toggle colors to show active layers in orange
function deselectOverlay(id) {
    $(id).removeClass('deep-orange');
    $(id).addClass('blue-grey');
}

function selectOverlay(id) {
    $(id).addClass('deep-orange');
    $(id).removeClass('blue-grey');
}

// created function to clear data layer thinking it would work for voronois too
function clearShapes() {
    map.data.forEach(function (dataPoint) {
        map.data.remove(dataPoint);
    });
}

// Make those buttons work!
$('#markers').on('click', () => {
    toggleMarkers();
})
$('#heatmap').on('click', () => {
    toggleHeatMap();
})
$('#delaunay').on('click', () => {
    toggleDelaunayTriangles();
})
$('#voronoi').on('click', () => {
    toggleVoronoiPolygons();
})