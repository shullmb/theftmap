var bikeLatLngs = [];
var bikeVoronoiData = []
const dataState = {
    heatmap: false,
    delaunay: false,
    voronoi: false
}
var voronoi = d3.voronoi();
var heatmap;

function initMap() {

    let searchCenter = new google.maps.LatLng(locationMap.lat,locationMap.lng);
    
    map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 15,
            center: searchCenter,
            styles: thftMapStyle,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
        }
    );

    bounds = new google.maps.LatLngBounds();
    
    bikes.forEach((bike) => {
        bikeVoronoiData.push([bike.lat,bike.lng])
        let latLng = new google.maps.LatLng(bike.lat,bike.lng);
        // collect for data viz
        bikeLatLngs.push(latLng);

        // drop pins for each bike
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

function delaunayTriangles() {
    if (dataState.delaunay == false) {
        dataState.delaunay = true;
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
        map.data.forEach(function (dataPoint) {
            map.data.remove(dataPoint);
        });
        dataState.delaunay = false;
    }
}

function heatMap() {
    if (dataState.heatmap == false) {
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: bikeLatLngs,
            radius: 30
        });    
        heatmap.setMap(map)
        dataState.heatmap = true;
    } else {
        heatmap.setMap(null);
        dataState.heatmap = false;
    }
}

document.getElementById('delaunay').addEventListener('click', delaunayTriangles);
document.getElementById('heatmap').addEventListener('click', heatMap);
