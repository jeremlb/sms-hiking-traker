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
		 var points = pointsService.getPoints();
         _this.items = [].concat(points).reverse();
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

		 if(item.weather === 'clear-day') {
			 tooltip = 'Grand soleil';
		 } else if(item.weather === 'clear-night') {
			 tooltip = 'Belle nuit clair';
		 } else if(item.weather === 'cloudy-weather') {
			 tooltip = 'Nuageux';
		 } else if(item.weather === 'haze-weather') {
			 tooltip = 'Brumeux';
		 } else if(item.weather === 'most-cloudy') {
			 tooltip = 'Très nuageux';
		 } else if(item.weather === 'most-cloudy-night') {
			 tooltip = 'Nuit très nuageux';
         } else if(item.weather === 'rain-snow') {
			 tooltip = 'Pluie et neige';
		 } else if(item.weather === 'rainy-weather') {
			 tooltip = 'Pluvieux';
		 } else if(item.weather === 'showcase') {
			 tooltip = 'Temps pourris';
		 } else if(item.weather === 'rain-snow') {
			 tooltip = 'Pluie et neige';
		 } else if(item.weather === 'snow-weather') {
			 tooltip = 'Neigeux';
		 } else if(item.weather === 'storm-weather') {
			 tooltip = 'Tempête';
		 } else if(item.weather === 'thunder-weather') {
			 tooltip = 'Orageux';
		 } else if(item.weather === 'unknown') {
			 tooltip = 'Pas de description';
		 } else if(item.weather === 'windy-weather') {
			 tooltip = 'Venteux';
		 }

		 return tooltip;
     };

     this.getBreakTooltip = function (item) {
		 var tooltip = null;

		if(item.break === 'eat') {
			tooltip = 'Pause dej\'';
		} else if(item.break === 'camp') {
			tooltip = 'Bivouac';
		} else if(item.break === 'break') {
			tooltip = 'Pause détente';
		} else if(item.break === 'finish') {
			tooltip = 'C\'est fini !';
		} else if(item.break === 'start') {
			tooltip = 'C\'est parti !';
		}

		return tooltip;
     };
}];
