/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
var angular = require('angular');

var lumx = require('lumx');
console.log(lumx);
var templateUrl = require('ngtemplate!html!./views/todomvc-index.html');

var module = angular.module('todomvc', [
	require('angular-route'),
	require('angular-resource'),
	'lumx'
]);



module.controller('TodoCtrl', require('./controllers/todoCtrl'));
module.factory('api', require('./services/todoApi'));
module.factory('todoStorage', require('./services/todoStorage'));
module.factory('localStorage', require('./services/localStorage'));

module.directive('todoEscape', require('./directives/todoEscape'));
module.directive('todoFocus', require('./directives/todoFocus'));

module.config(['$routeProvider', function ($routeProvider) {
		'use strict';

		var routeConfig = {
			controller: 'TodoCtrl',
			templateUrl: templateUrl,
			resolve: {
				store: ['todoStorage', function (todoStorage) {
					// Get the correct module (API or localStorage).
					return todoStorage.then(function (module) {
						module.get(); // Fetch the todo records in the background.
						return module;
					});
				}]
			}
		};

		$routeProvider
			.when('/', routeConfig)
			.when('/:status', routeConfig)
			.otherwise({
				redirectTo: '/'
			});
	}]);
