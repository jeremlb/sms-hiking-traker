var angular = require('angular');

module.exports = ['mapManagerService', 'uiEventsService',
        function (mapManagerService, uiEventsService) {
    var service = {};

    var service = {
        onResume: onResume,
        addMarker: addMarker,
        removeMarker: removeMarker,
        focusMarker: focusMarker,
        showMarkers: showMarkers
    };

    var _map = null;
    var _markers = [];
    var _bounds = null;
    var _this = this;

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

    function addMarker(key, point) {
        var position = new google.maps.LatLng(point.latitude, point.longitude);
        var marker = new google.maps.Marker({
            position: position,
            icon: '/static/img/marker/marker-' + point.break + '.png',
            map: _map
        })

        marker.set('point', key);

        marker.addListener('click', function () {
            uiEventsService.openPanel(this.get('point'));
            focusMarker(this);
        });

        _markers.push(marker);

        if(_bounds === null) {
            _bounds = new google.maps.LatLngBounds(position, position);
        } else {
            _bounds.extend(position);
        }

        showMarkers();

        return marker;
    }

    function removeMarker (marker) {
        marker.setMap(null);
        return true;
    }

    function focusMarker(marker) {
        _map.panTo(marker.getPosition());
        _map.setZoom(15);
    }

    function showMarkers() {
        _map.fitBounds(_bounds);
    }

    return service;
}];
