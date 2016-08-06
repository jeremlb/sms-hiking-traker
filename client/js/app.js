/**
 *
 * @type {angular.Module}
 */

// require('style!css!../css/style.css')

var angular = require('angular');

require('angular-touch');
require('angular-carousel');

var indexTemplate = require('ngtemplate!html!./views/app-index.html');
var aboutTemplate = require('ngtemplate!html!./views/app-about.html');
var contactTemplate = require('ngtemplate!html!./views/app-contact.html');

var module = angular.module('jerem-on-the-road', [
	require('angular-route'),
	require('angular-resource'),
	require('angular-cookies'),
	require('./vendors/gmaploader'),
	require('./vendors/lumx'),
	require('angularfire'),
	'angular-carousel'
]);

module.controller('AppCtrl', require('./controllers/appController'));

module.service('firebaseService', require('./services/firebaseService'));
module.service('mapService', require('./services/mapService'));
module.service('photosService', require('./services/photosService'));
module.service('mapManagerService', require('./services/mapManagerService'));

module.directive('uiMap', require('./directives/uimap'));
module.directive('listPanel', require('./directives/listPanel'));
module.directive('detailPanel', require('./directives/detailPanel'));
module.directive('deferredCloak', require('./directives/deferredCloak'));

module.config(['$routeProvider', 'uiGmapGoogleMapApiProvider',
	'$locationProvider',
		function ($routeProvider, uiGmapGoogleMapApiProvider,
		$locationProvider) {
	'use strict';

	$routeProvider
		.when('/', {
			controller: 'AppCtrl as ctrl',
			templateUrl: indexTemplate
		})
		.when('/about', {
			// controller: 'AboutCtrl as ctrl',
			templateUrl: aboutTemplate
		})
		.when('/contact', {
			// controller: 'ContactCtrl as ctrl',
			templateUrl: contactTemplate
		})
		.otherwise({
			redirectTo: '/'

		});

	uiGmapGoogleMapApiProvider.configure({
		v: '3.24', //defaults to latest 3.X anyhow
		libraries: 'weather,geometry,visualization',
		key: 'AIzaSyA2kDhi5S_z0Lu8k7HiYRMdwnRumhGA0sc'
	});

	// use the HTML5 History API
	// $locationProvider.html5Mode(true);
	// $locationProvider.hashPrefix('#');
}]);

angular.element(document).ready(function () {
  angular.bootstrap(document, ['jerem-on-the-road']);
});
