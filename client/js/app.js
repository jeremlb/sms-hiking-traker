/**
 *
 * @type {angular.Module}
 */

require('style!css!../css/style.css')
require('style!css!angular-material/angular-material.css')

var angular = require('angular');

var templateUrl = require('ngtemplate!html!./views/app-index.html');

var module = angular.module('jerem-on-the-road', [
	require('angular-route'),
	require('angular-resource'),
	require('angular-material'),
	require('./vendors/gmaploader'),
	require('angularfire')
]);

module.controller('AppCtrl', require('./controllers/AppController'));

module.service('firebaseService', require('./services/firebaseService'));
module.service('mapService', require('./services/mapService'));
module.service('photosService', require('./services/photosService'));
module.service('mapManagerService', require('./services/mapManagerService'));

module.directive('uiMap', require('./directives/uimap'));

module.config(['$routeProvider', 'uiGmapGoogleMapApiProvider',
			function ($routeProvider, uiGmapGoogleMapApiProvider) {
		'use strict';

		var routeConfig = {
			controller: 'AppCtrl as ctrl',
			templateUrl: templateUrl
		};

		$routeProvider
			.when('/', routeConfig)
			.otherwise({
				redirectTo: '/'
			});

		uiGmapGoogleMapApiProvider.configure({
			v: '3.25', //defaults to latest 3.X anyhow
			libraries: 'weather,geometry,visualization'
		});
}]);

angular.element(document).ready(function () {
  angular.bootstrap(document, ['jerem-on-the-road']);
});
