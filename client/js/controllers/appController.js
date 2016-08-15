var angular = require('angular');

module.exports = ['firebaseService',  'mapService', 'pointsService',
     'LxDialogService', 'uiEventsService', '$rootScope', '$timeout',
		function (firebaseService, mapService, pointsService,
          LxDialogService, uiEventsService, $rootScope, $timeout) {

     var _this = this;

     var _show_progress = true;
	 var _isMenuSwipedUp = false;
	 var _openCarousel = false;

	 this.itinerary = false;

	 function getMedia(points, mediaType) {
		 var point;
		 var i = 0;
		 var media = 0;
		 var medias = [];
		 var m;

		//  console.log(point, points.length, point < points.length);

		 for(i = 0; i < points.length; i += 1) {
			 point = points[i];
			 if(point.hasOwnProperty(mediaType) && point[mediaType]) {

				 for(media = 0; media < point[mediaType].length; media += 1) {
					 m = {
						 url: point[mediaType][media].http,
						 urlHttps: point[mediaType][media].https,
						 size: point[mediaType][media].size,
						 smsKey: point.key
					 };

					 if (mediaType === 'videos') {
						 m.formats =  point[mediaType][media].format;
						 m.smsKey = point.key;
					 }

					 medias.push(m);
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
	 });

     this.showProgress = function () {
          return _show_progress;
     };

     // album dialog
     this.dialogId = 'album-1';
	 this.carouselId = 'carousel';

     this.openAlbum = function () {
          LxDialogService.open(_this.dialogId);
     };

     this.closeAlbum = function () {
          LxDialogService.close(_this.dialogId);
     };

	 this.openCarousel = function () {
		 _openCarousel = true;
		 _this.closeAlbum();
	 };

	 this.closeCarousel = function () {
		  LxDialogService.close(_this.carouselId);
	 };

	 this.carouselId = 'carouselId';

	 this.showDetail = function (key) {
		 var point = pointsService.getPoint(key);

		 if(point && point.marker) {
			 _this.closeAlbum();
			 uiEventsService.openPanel(key);
			 mapService.focusMarker(point.marker);
		 }
	 };

	 this.isMenuSwipedUp = function () {
		 return _isMenuSwipedUp;
	 };

	 this.showMenu = function () {
		 _isMenuSwipedUp = true;
	 };

	 this.hideMenu = function () {
	 	_isMenuSwipedUp = false;
	 };

	 this.clickItineraryButton = function () {
		 if(_this.itinerary === true) {
			 mapService.showItinerary();
		 } else {
			 mapService.hideItinerary();
		 }
	 };

	 // when route change remove reset ui
	 $rootScope.$on('$routeChangeStart', function (event) {
		 _this.hideMenu();
		 mapService.hideItinerary(); // in controller constructor hide itinerary
	 });

	 // to prevent any DOM problems with LxDialogService
	 $rootScope.$on('lx-dialog__close-end', function (event, dialogId) {
		 if(dialogId === _this.carouselId) {
			 _this.openAlbum();
		 } else if(dialogId === _this.dialogId && _openCarousel === true) {
			 _openCarousel = false;
			 LxDialogService.open(_this.carouselId);
		 }
	 });
}];
