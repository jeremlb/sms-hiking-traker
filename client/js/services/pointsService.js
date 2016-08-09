var angular = require('angular');

module.exports = ['mapService', 'uiEventsService',
        function (mapService, uiEventsService) {
    var service = {
        addPoint: addPoint,
        removePoint: removePoint,
        updatePoint: updatePoint,
        getPoints: getPoints,
        getPoint: getPoint
    };

    var _points = {};   // models shared in the all application

    function addPoint(key, point) {
        _points[key] = {
			key: key,
            id: point.id,
            latitude: point.latitude,
            longitude: point.longitude,
            message: point.message,
            break: point.break,
            weather: point.weather,
            date: point.date,
            photos: (point.photos)? point.photos: undefined,
            videos: (point.videos)? point.videos: undefined
        };

        _points[key].marker = mapService.addMarker(key, {
            latitude: point.latitude,
            longitude: point.longitude,
            icon:  point.break
        });

        uiEventsService.refreshUi();
    }

    function removePoint(key) {
        if(_points.hasOwnProperty(key)) {
            mapService.removeMarker(_points[key].marker);
            delete _points[key];
            uiEventsService.refreshUi();
            return true;
        }

        return false;
    }

    function updatePoint(key, new_point) {
        var point = getPoint(key);

        if(point) {
            point.id =  new_point.id;
            point.latitude  = new_point.latitude;
            point.longitude = new_point.longitude;
            point.message = new_point.message;
            point.break   = new_point.break;
            point.weather = new_point.weather;
            point.date   = new_point.date;
            point.photos =  (new_point.photos)? new_point.photos: undefined;
            point.videos =  (new_point.videos)? new_point.videos: undefined;

            mapService.updateMarker(point.marker, {
                latitude: point.latitude,
                longitude: point.longitude,
                icon:  point.break
            });
        }

        uiEventsService.refreshUi();
    }

    function getPoints() {
        var point;
        var pointsArray = [];

        for(point in _points) {
            pointsArray.push(_points[point]);
        }

        return pointsArray;
    }

    function getPoint(key) {
        if(_points.hasOwnProperty(key)) {
            return _points[key];
        }

        return null;
    }

    return service;
}];
