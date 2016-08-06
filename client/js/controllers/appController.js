var angular = require('angular');
require('firebase/firebase');

module.exports = ['firebaseService', 'photosService',  'mapService',
		function (firebaseService, photosService, mapService) { 

     var _this = this;

     firebaseService.initFirebase();
	mapService.onResume();

}];
