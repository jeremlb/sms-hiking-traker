var angular = require('angular');

module.exports = ['$firebaseArray', 'mapService',
 		function ($firebaseArray, mapService) {

    var service = {
		initFirebase: initFirebase
	};

	 var config = {
		 apiKey: "AIzaSyBvL-tziEjVD2IGasWC6Gu64-qd89JLWe4",
	     authDomain: "jerem-on-the-road.firebaseapp.com",
	     databaseURL: "https://jerem-on-the-road.firebaseio.com",
	     storageBucket: "jerem-on-the-road.appspot.com",
	 };

	 var refs = null;
	 var points = null;

	 function initFirebase () {
		 if(refs === null) {
			 firebase.initializeApp(config);

			 ref = firebase.database().ref().child('point');

			 points = $firebaseArray(ref);
			 points.$watch(function(event) {
				 if(event === 'add') {
					 mapService.addMarker(points.$getRecord(event.key));
					 
				 } else if (event === 'remove') {
					 mapService.removeMarker(points.$getRecord(event.key));
				 } else if (event === 'update') {
					 mapService.updateMarker(points.$getRecord(event.key));
				 }
			 });
		 } else {
			 mapService.refreshMarkers();
		 }
	 }

    return service;
}];
