var map;
var geocoder;
var centerMarker;

const searchCenter = { lat: 47.60621, lng: -122.33207 };

function initMap() {
    map = new google.maps.Map(
        document.getElementById('map'),{
            zoom: 10,
            center: center,
            styles: thftMapStyle,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,

        }
    );

    centerMarker = new google.maps.Marker({
        position: center,
        map,
        icon: greyPin
    })

    console.log(centerMarker);
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var initialLocation = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
            );
            map.setCenter(initialLocation);
            centerMarker.setPosition(map.center);
            $('#location').val(initialLocation);
        });
    }

    geocoder = new google.maps.Geocoder();

    $('#searchArea').click( function(e) {
        e.preventDefault();
        geocodeAddress(geocoder, map)
        console.log(centerMarker.position)  
    })
}

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {
            // recenter map
            resultsMap.setCenter(results[0].geometry.location);
            centerMarker.setPosition(results[0].geometry.location);
            // set hidden input
            $('#location').val(address);
        } else {
            console.log('error: ' + status);
        }
    });
}

