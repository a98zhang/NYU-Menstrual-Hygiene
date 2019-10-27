const db = require('./db');
const mongoose = require('mongoose');
const Location = mongoose.model('Location');

/* 
Reference:
https://developers.google.com/maps/documentation/javascript/adding-a-google-map
https://stackoverflow.com/questions/3059044/google-maps-js-api-v3-simple-multiple-marker-example
https://stackoverflow.com/questions/8769966/google-maps-api-open-url-by-clicking-on-marker
*/


    // set multiple marker
    for (var i = 0; i < 250; i++) {
        // init markers
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(southWest.lat() + latSpan * Math.random(), southWest.lng() + lngSpan * Math.random()),
            map: map,
            title: 'Click Me ' + i
        });
        // process multiple info windows
        (function (marker, i) {
            // add click event
            google.maps.event.addListener(marker, 'click', function () {
                infowindow = new google.maps.InfoWindow({
                    content: 'Hello, World!!'
                });
                infowindow.open(map, marker);
            });
        })(marker, i);
    }

function showInfo(loc, marker) {

    const content = {
        name = loc.name,
        type = loc.type,
        campus = loc.campus,
        items = loc.items
    }

    google.maps.event.addListener(marker, 'click', function () {
        inforwindow = new google.maps.InfoWindow({
            content: content
        });
        infowindow.open(map, marker)
    });
}

function initMap() {
    // map options
    const nyu = {lat: 0, lng: 0};
    
    // init map
    const map = new google.maps.Map(document.getElementById('map'),{
        zoom: 10,
        center: nyu
    });

    // load locations
    Location.find(query, function(err, locations) {
        locations.forEach(loc => {
            // set markers
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(loc.lat, loc.lng),
                map: map,
                title: 'Click'
            });
            // add click
            showInfo(loc, marker);
        })
    })
}

