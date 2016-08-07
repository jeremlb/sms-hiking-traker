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
        var marker = mapService.addMarker(key, point);

        point.marker = marker;
        _points[key] = point;

        uiEventsService.refreshUi();
    }

    function removePoint(key) {
        if(_points.hasOwnProperty(key)) {
            mapService.removeMarker(_points[key].marker);
            delete _points[key];
            return true;
        }


        uiEventsService.refreshUi();
        return false;
    }

    function updatePoint(key, point) {
        //TODO: add update support
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
