var angular = require('angular');

module.exports = ['uiEventsService', 'pointsService', '$scope', 'mapService',
          function (uiEventsService, pointsService, $scope, mapService) {

     var _this = this;

     this.isDetailShown = false;
     this.detailItem = {};
     this.items = pointsService.getPoints();

     uiEventsService.setPanelListener(function (key) {
          _this.detailItem = pointsService.getPoint(key);
          _this.isDetailShown = true;
          $scope.$apply();
     });

     uiEventsService.setUiListener(function () {
          _this.items = pointsService.getPoints();
     });

     this.showDetail = function (item) {
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
}];
