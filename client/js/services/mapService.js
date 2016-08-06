var angular = require('angular');

module.exports = ['mapManagerService', function (mapManagerService) {
    var service = {};

    var service = {
        onResume: onResume,
        addMarker: addMarker,
        deleteMarker: deleteMarker,
        refreshMarkers: refreshMarkers,
    };

    var _map = null;
    var _markers = [];
    var _bounds = null;

    function onCreate() {
        mapManagerService.onReady().then(function () {
            var center = new google.maps.LatLng(46.48361, 2.52639);

            var mapOptions = {
                center: center,
                zoom: 6,
                styles: [{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"poi.business","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"weight":0.5},{"color":"#333333"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"gamma":1},{"saturation":50}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":50},{"hue":"#50a5d1"}]}]
            };
            mapManagerService.createMap(mapOptions).then(function (map) {
                _map = map;
                initMap();
            });
        });
    }

    function onResume () {
        if(_map === null) {
            onCreate();
        } else {
            initMap();
        }
    }

    function initMap() {}

    function addMarker(point) {
        var position = new google.maps.LatLng(point.latitude, point.longitude);
        var marker = new google.maps.Marker({
            position: position,
            map: _map
        })

        _markers.push(marker);

        if(_bounds === null) {
            _bounds = new google.maps.LatLngBounds(position, position);
        } else {
            _bounds.extend(position);
        }

        _map.fitBounds(_bounds);

        return marker;
    }

    function deleteMarker (point) {

    }

    function refreshMarkers () {

    }

    return service;
}];
