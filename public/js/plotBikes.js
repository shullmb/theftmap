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
        let latLng = new google.maps.LatLng(bike.lat,bike.lng);
        let mrk = new google.maps.Marker({ position: latLng, map: map, icon: doPin });
        bounds.extend(latLng);
        map.fitBounds(bounds);
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