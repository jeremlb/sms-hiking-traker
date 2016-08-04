var angular = require('angular');

function MapServiceException(message) {
    this.message = message;
    this.name = "MapServiceException";
}

module.exports = ['$q', 'uiGmapGoogleMapApi', function ($q, uiGmapGoogleMapApi) {
    var service = {
        isMapReady: isMapReady,
        onReady: onReady,
        createMap: createMap,
        getMap: getMap,
        hasElement: hasElement,
        setElement: setElement,
        getElement: getElement

    };
    var _isMapReady = false;
    var _waitingForDirective = false;

    var _map = null;
    var _element = null;
    var _callbackMapReadyListener = [];
    var _callbackCreateMapListener = [];


    uiGmapGoogleMapApi.then(function(maps) {
        _isMapReady = true;

        for(var i = 0; i < _callbackMapReadyListener.length; i += 1) {
            _callbackMapReadyListener[i]();
        }

        _callbackMapReadyListener = [];
    });

    function isMapReady () {
        return _isMapReady;
    }

    function onReady() {
        var deferred = $q.defer();

        if(_isMapReady === true) {
            deferred.resolve(_map);
        } else {
            _callbackMapReadyListener.push(function () {
                deferred.resolve();
            });
        }

        return deferred.promise;
    }

    function createMap(mapOptions) {
        var deferred = $q.defer();

        _callbackCreateMapListener.push(function (_map) {
            deferred.resolve(_map);
        });

        if(_element !== null) {
            if(_map === null) {
                _map = new google.maps.Map(_element, mapOptions);
            } else {
                _map.setOptions(mapOptions);
            }

            for(var i = 0; i < _callbackCreateMapListener.length; i += 1) {
                _callbackCreateMapListener[i](_map);
            }
            _callbackCreateMapListener = [];

        } else {
            _waitingForDirective = true;
        }

        return deferred.promise;
    }

    function setElement(element) {
        if(_element === null) {
            _element = element;
            return service;
        }

        throw new MapServiceException('Un seul element peut être créé');
    }

    function hasElement() {
        return (_element !== null);
    }

    function getElement() {
        return _element;
    }

    function getMap() {
        return _map;
    }

    return service;
}];
