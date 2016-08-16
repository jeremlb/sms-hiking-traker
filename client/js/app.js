/**
 *
 * @type {angular.Module}
 */

// require('style!css!../css/style.css')

var angular = require('angular');

require('angular-swipe');

var indexTemplate = require('ngtemplate!html!./views/app-index.html');
var aboutTemplate = require('ngtemplate!html!./views/app-about.html');
var contactTemplate = require('ngtemplate!html!./views/app-contact.html');

require('angular-touch');
require('angular-carousel');

var module = angular.module('jerem-on-the-road', [
	require('angular-route'),
	require('angular-cookies'),
	'angular-carousel',
	'swipe',
	require('./vendors/gmaploader'),
	require('./vendors/lumx'),
	require('angularfire'),
]);

module.controller('AppCtrl', require('./controllers/appController'));
module.controller('MainCtrl', require('./controllers/mainController'));
module.controller('PanelCtrl', require('./controllers/panelController'));

module.service('firebaseService', require('./services/firebaseService'));
module.service('pointsService', require('./services/pointsService'));
module.service('uiEventsService', require('./services/uiEventsService'));
module.service('mapService', require('./services/mapService'));
module.service('mapManagerService', require('./services/mapManagerService'));
module.service('sidebarService', require('./services/sidebarService'));

module.directive('uiMap', require('./directives/uimap'));
module.directive('uiPanel', require('./directives/uiPanel'));
module.directive('deferredCloak', require('./directives/deferredCloak'));

module.config(['$routeProvider', 'uiGmapGoogleMapApiProvider',
	'$locationProvider', '$sceDelegateProvider',
		function ($routeProvider, uiGmapGoogleMapApiProvider,
		$locationProvider, $sceDelegateProvider) {
	'use strict';


	$sceDelegateProvider.resourceUrlWhitelist([
	    // Allow same origin resource loads.
	    'self',
	    // Allow loading from our assets domain.  Notice the difference between * and **.
	    'https://video.twimg.com/**'
	  ]);

	$routeProvider
		.when('/', {
			controller: 'AppCtrl as ctrl',
			templateUrl: indexTemplate
		})
		.when('/detail/:id', {
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
		v: '3.25', //defaults to latest 3.X anyhow
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
