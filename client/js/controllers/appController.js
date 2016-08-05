var angular = require('angular');
require('firebase/firebase');

module.exports = ['mapService', 'firebaseService', 'photosService',
		'LxNotificationService',
		'$firebaseArray', '$scope',
		function (mapService, firebaseService, photosService, LxNotificationService, $firebaseArray,
		$scope) {

     var _this = this;

	 // Initialize Firebase. Use your own config values here. This is just a sample.
	 // You can copy and paste your config values by following the instructions at
	 // https://firebase.google.com/docs/web/setup#add_firebase_to_your_app.
	 var config = {
		 apiKey: "AIzaSyBvL-tziEjVD2IGasWC6Gu64-qd89JLWe4",
	     authDomain: "jerem-on-the-road.firebaseapp.com",
	     databaseURL: "https://jerem-on-the-road.firebaseio.com",
	     storageBucket: "jerem-on-the-road.appspot.com",
	 };

	 mapService.onResume();

	 firebase.initializeApp(config);
	 var ref = firebase.database().ref().child('point');

	 this.messages = $firebaseArray(ref);

	 this.messages.$watch(function(event) {
		mapService.addMarker(_this.messages.$getRecord(event.key));
	 });
}];
