var angular = require('angular');

require('firebase/firebase');

module.exports = ['$firebaseArray', 'mapManagerService', 'pointsService',
 		function ($firebaseArray, mapManagerService, pointsService) {

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

		 // if the connexion is bad the could be generate an error
		 // if maps is not loaded
		 mapManagerService.onReady().then(function () {
			 if(refs === null) {
				 firebase.initializeApp(config);

				 refs = firebase.database().ref().child('point');
				 points = $firebaseArray(refs);


				 points.$watch(function(event) {
					 if(event.event === 'child_added') {
						 pointsService.addPoint(event.key,
							 					points.$getRecord(event.key))
					 } else if(event.event === 'child_removed') {
						 pointsService.removePoint(points.$getRecord(event.key));
					 } else if(event.event === 'child_changed') {
						 pointsService.updatePoint(event.key,
							 					   points.$getRecord(event.key));
					 }
				 });
			 }
		 });
	 }

    return service;
}];
