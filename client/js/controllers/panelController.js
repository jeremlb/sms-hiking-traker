var angular = require('angular');

module.exports = ['uiEventsService', 'pointsService', '$scope', 'mapService',
          '$location', '$routeParams',
          function (uiEventsService, pointsService, $scope, mapService, $location, $routeParams) {

     var _this = this;

     this.isDetailShown = false;
     this.detailItem = {};
     this.items = pointsService.getPoints();

     uiEventsService.setPanelListener(function (key) {
          _this.detailItem = pointsService.getPoint(key);
          _this.isDetailShown = true;
          $scope.$apply();
     });

     uiEventsService.addUiListener(function () {
          _this.items = pointsService.getPoints();
     });

     this.showDetail = function (item) {
          //  $location.url('detail/' + '-KO_pZchey1I2CAPpP2_')
          _this.detailItem = item;
          _this.isDetailShown = true;

          if(item.marker) {
               mapService.focusMarker(item.marker);
          }
     };

     this.hideDetail = function () {
          _this.isDetailShown = false;
          mapService.showMarkers();
     };

     this.getWeatherIconUrl = function (item) {
          if(item.weather) {
               return '/static/img/weather/' + item.weather + '.png';
          }
     };

     this.getBreakIconUrl = function (item) {
          if(item.break) {
               // TODO: change to break icon
               return '/static/img/break/' + item.break + '.png';
          }
     };
}];
