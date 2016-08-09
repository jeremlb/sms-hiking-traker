var angular = require('angular');

module.exports = ['firebaseService',  'mapService', 'pointsService',
     'LxDialogService', '$cookies', 'uiEventsService',
		function (firebaseService, mapService, pointsService,
          LxDialogService, $cookies, uiEventsService) {

     var _this = this;

     var _show_progress = true;

	 function getMedia(points, mediaType) {
		 var point;
		 var i = 0;
		 var media = 0;
		 var medias = [];

		//  console.log(point, points.length, point < points.length);

		 for(i = 0; i < points.length; i += 1) {
			 point = points[i];
			 if(point.hasOwnProperty(mediaType) && point[mediaType]) {

				 for(media = 0; media < point[mediaType].length; media += 1) {
					 console.log(point[mediaType][media]);
					 if(mediaType === 'photos') {
						 medias.push({
							 url: point[mediaType][media].url,
							 urlHttps: point[mediaType][media].https,
							 smsKey: point.key
						 });
					 } else if (mediaType === 'videos') {
						 medias.push({
							 formats: point[mediaType][media].format,
							 smsKey: point.key
						 });
					 }
				 }
			 }
		 }

		 return medias;
	 }

     this.photos = [];
	 this.videos = [];

     // init
     mapService.onResume(); // init the map when ready

     // init the firebase connexion
     firebaseService.initFirebase().then(function () {
          _show_progress = false;
     });

	 // init refresh ui when new data arrived
	 uiEventsService.addUiListener(function () {
		 var points = pointsService.getPoints();

		 _this.photos = getMedia(points, 'photos');
		 _this.videos = getMedia(points, 'videos');

		 console.log(_this.photos);
		 console.log(_this.videos);
	 });

     this.showProgress = function () {
          return _show_progress;
     };

     // album dialog
     this.dialogId = 'album-1';
     this.openAlbum = function () {
          LxDialogService.open(_this.dialogId);
     };

     this.closeAlbum = function () {
          LxDialogService.close(_this.dialogId);
     };

	 this.showDetail = function (key) {
		 var point = pointsService.getPoint(key);

		 if(point && point.marker) {
			 _this.closeAlbum();
			 uiEventsService.openPanel(key);
			 mapService.focusMarker(point.marker);
		 }
	 };

     // open a dialog when it's the first visit and set a cookie
     if($cookies.get('4d7b7ef4-5be4') === undefined) {
          LxDialogService.open('premiere-visite');
          $cookies.put('4d7b7ef4-5be4', true, {
               'expires': new Date("March 8, 2100 17:05:00")
          });
     }
}];
