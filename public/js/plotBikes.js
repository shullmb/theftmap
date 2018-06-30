var bikeLatLngs = [];
var bikeVoronoiData = []
var heatmap;

function initMap() {

    let searchCenter = new google.maps.LatLng(locationMap.lat,locationMap.lng);
    
    map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 10,
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

    // heatmap = new google.maps.visualization.HeatmapLayer({
    //     data: bikeData,
    //     map: map
    // });
    var voronoi = d3.voronoi();

    let polygons = voronoi.polygons(bikeVoronoiData);
    console.log(polygons);
    let polyCoords = _.chunk(_.flattenDeep(voronoi.triangles(bikeVoronoiData)),2)
    // console.log(polyCoords);
    
    let a = [];
    polyCoords.forEach( (coord) => {
        let b = {lat: coord[0], lng: coord[1]}
        a.push(b)
    })
    
    let triangleCoords = _.chunk(a,3);
    
    // .map( function(coord, i) {
    //     if (i%2 === 0) {
    //         return {lng: coord};
    //     } else {
    //         return {lat: coord};
    //     }
    // })
    // console.log((_.chunk(_.chunk(polyCoords, 2),3));

    // Define the LatLng coordinates for the polygon.
    // delaunayTriangles.forEach( (arr) => {
    //     arr.forEach( (coords) => {
    //         polyCoords.push
    //     })
    // })

    // var triangleCoords = [
    //     { lat: 25.774, lng: -80.190 },
    //     { lat: 18.466, lng: -66.118 },
    //     { lat: 32.321, lng: -64.757 }
    // ];

    // Construct the polygon.
    triangleCoords.forEach( (triangle) => {
        let triangleFill = new google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: '#617C8A',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FB572F',
            fillOpacity: 1,
        });
        triangleFill.setMap(map);
    } )


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