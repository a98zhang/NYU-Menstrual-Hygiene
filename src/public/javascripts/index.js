/* 
Reference:
https://developers.google.com/maps/documentation/javascript/adding-a-google-map
https://stackoverflow.com/questions/3059044/google-maps-js-api-v3-simple-multiple-marker-example
https://stackoverflow.com/questions/8769966/google-maps-api-open-url-by-clicking-on-marker
https://github.com/googlemaps/google-maps-services-js
*/

  
let map;
let markers;
const nyu = {lat: 40.729782, lng: -73.996439};

function showInfo(loc, marker) {

    // hof#1
    const items = loc.items.map(item => {
        let status = item.name;
        if (item.shortage) {
            status += " - Currently Out of Stock";
        }
        else if (item.free) {
            status += " - Available For Free";
        }
        else {
            status += " - Available & Bring Coins";
        }
        return status;
    })
    
    const contentString = '<div id="content">'+
    '<h3 id="firstHeading" class="firstHeading">'+loc.name+'</h1>'+
    '<p>Type:  '+loc.type+ '</p>'+
    '<p>Campus:  '+loc.campus+ '</p>'+
    '<p>Items:</p><ul><li>'+items[0]+'<li><li>'+items[1]+'</li></ul>'+
    '</div>';

    google.maps.event.addListener(marker, 'click', function () {
        infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        infowindow.open(map, marker);
    });
}


function getLocations(url) {

    function  reset() {
        document.querySelector('input[name="loctQ"]').value = "";
        document.querySelector('select[name="typeQ"]').selectedIndex = 0;
        document.querySelector('select[name="campQ"]').selectedIndex = 0;
    }

    function addMarkers(locations) {
        markers = [];
        // hof#2
        locations.forEach(loc => {
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(loc.lat, loc.lng),
                map: map,
                title: 'Click',
                animation: google.maps.Animation.DROP
            });
            showInfo(loc, marker);
            markers.push(marker);
            })   
    }

    fetch(url)
    .then(res => {
        if (!res.ok) throw new Error('HTTP error:' + res.statusText);   
        return res.json();
    }, () => console.log('Network error or cross domain request'))
    .then(addMarkers)
    .then(reset);
}

function initMap() {
    // initialize
    
    map = new google.maps.Map(document.getElementById('map'),{
        zoom: 12,
        center: nyu
    });

    getLocations('map');
}

function handleFilter() {

    map = new google.maps.Map(document.getElementById('map'),{
        zoom: 12,
        center: nyu
    });

    let queries = [];
    queries.unshift({
        field: "loctQ", 
        val: document.querySelector('input[name="loctQ"]').value
        });
    const typeSelector = document.querySelector('select[name="typeQ"]')
    queries.unshift({
        field: "typeQ", 
        val: typeSelector.options[typeSelector.selectedIndex].value
        });
    const campSelector = document.querySelector('select[name="campQ"]')
    queries.unshift({
        field: "campQ", 
        val: campSelector.options[campSelector.selectedIndex].value
        });
        
    // hof#3
    const query = queries.reduce(function(accum, query) {
        if (query.val){
            accum += (accum) ? '&' : '?' 
            accum += query.field + '=' + query.val;
        }     
        return accum;
    }, '')

    const url = 'map' + query;
    getLocations(url);
}

function main() {
    const mapJs = document.createElement('script');
    mapJs.type = 'text/javascript';
    mapJs.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBIi6he6hCO-UvASxUSHnSIrSioKJO3i44&callback=initMap"
    document.getElementsByTagName('body')[0].appendChild(mapJs);

    const btn = document.querySelector('input.filter');
    btn.addEventListener('click', handleFilter);
}

document.addEventListener("DOMContentLoaded", main);
