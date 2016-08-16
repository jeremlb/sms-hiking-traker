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

		if(!$scope.$$phase) {
			$scope.$apply();
		}
     });

     uiEventsService.addUiListener(function () {
		 var o_points = [];
		 var points = pointsService.getPoints();
		 var point = points.length - 1;

		 for(; point >= 0; point -= 1) {
			 o_points.push(points[point]);
		 }

          _this.items = o_points;
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

	 this.getWeatherTooltip = function (item) {
		 var tooltip = null;

		 if(item.weather === '') {
			 tooltip = null;
		 } else if(item.weather === '') {
			 tooltip = null;
		 } else if(item.weather === '') {
			 tooltip = null;
		 } else if(item.weather === '') {
			 tooltip = null;
		 } else if(item.weather === '') {
			 tooltip = null;
		 } else if(item.weather === '') {
         }

		 return tooltip;
     };

     this.getBreakTooltip = function (item) {
		 var tooltip = 'TEST';

		if(item.break === '') {
			tooltip = null;
		} else if(item.break === '') {
			tooltip = null;
		} else if(item.break === '') {
			tooltip = null;
		} else if(item.break === '') {
			tooltip = null;
		} else if(item.break === '') {
			tooltip = null;
		} else if(item.break === '') {
			tooltip = null;
		 }

		return tooltip;
     };
}];
