var angular = require('angular');

module.exports = ['firebaseService',  'mapService', 'pointsService',
     'LxDialogService', 'uiEventsService', '$rootScope', '$timeout', '$document',
		function (firebaseService, mapService, pointsService,
          LxDialogService, uiEventsService, $rootScope, $timeout, $document) {

     var _this = this;

     var _show_progress = true;
	 var _isMenuSwipedUp = false;

	 var _openCarousel = false;
	 var _openAlbum = false;

	 var _isCarouselOpen = false;
	 var _isAlbumOpen = false;

	 this.carouselMedias = [];
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
						 smsKey: point.key,
						 type: 'photo'
					 };

					 if (mediaType === 'videos') {
						 m.formats =  point[mediaType][media].format;
						 m.smsKey = point.key;
						 m.type = 'video';
					 }

					 medias.push(m);
				 }

			 }
		 }
		 console.log(medias);

		 return medias;
	 }

	 function _closeAllDialog() {
		 _openAlbum = false;
		 _openCarousel = false;

		 if(_isCarouselOpen === true) {
			 console.log('close carousel');
			 _this.closeCarousel();
		 }

		 if(_isAlbumOpen === true) {
			 console.log('close album');
			 _this.closeAlbum();
		 }
	 }

     this.photos = [];
	 this.videos = [];

	 this.carouselIndex = 0;

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
		  _isAlbumOpen = true;
          LxDialogService.open(_this.dialogId);
     };

     this.closeAlbum = function () {
		 _isAlbumOpen = false;
		 LxDialogService.close(_this.dialogId);
     };

	 this.openCarousel = function (mediaType, $index) {
		 _this.carouselIndex = $index;

		 if(mediaType === 'photos') {
			 _this.carouselMedias = _this.photos;
		 } else {
			 _this.carouselMedias = _this.videos;
			 console.log(_this.carouselMedias);
		 }

		 _openCarousel = true;
		 _this.closeAlbum();
	 };

	 this.closeCarousel = function () {
		  _isCarouselOpen = false;
		  LxDialogService.close(_this.carouselId);
	 };

	 function _carouselPrev() {
		 if(_isCarouselOpen === true) {
			 if(_this.carouselIndex - 1 < 0) {
				 _this.carouselIndex = _this.carouselMedias.length - 1;
			 } else {
				 _this.carouselIndex -= 1;
			 }
		 }
	 }

	 function _carouselNext() {
		 if(_isCarouselOpen === true) {
			 if(_this.carouselIndex + 1 > _this.carouselMedias.length - 1) {
			 	_this.carouselIndex = 0;
			 } else {
			 	_this.carouselIndex += 1;
			 }
		 }
	 }

	 this.carouselId = 'carouselId';

	 this.showDetail = function ($event, key) {
		 $event.stopPropagation();
		 _closeAllDialog();

		 var point = pointsService.getPoint(key);

		 if(point && point.marker) {
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

		 _this.hideMenu();
	 };

	 // when route change remove reset ui
	 $rootScope.$on('$routeChangeStart', function (event) {
		 _this.hideMenu();
		 mapService.hideItinerary(); // in controller constructor hide itinerary
	 });

	 // to prevent any DOM problems with LxDialogService
	 $rootScope.$on('lx-dialog__close-end', function (event, dialogId) {
		 if(dialogId === _this.carouselId && _openAlbum === true) {
			 _openAlbum = false;
			 _this.openAlbum();

		 } else if(dialogId === _this.dialogId && _openCarousel === true) {
			 _openCarousel = false;
			 _openAlbum = true;
			 _isCarouselOpen = true;
			 LxDialogService.open(_this.carouselId);
		 }
	 });

	$document.keyup(function (e) {
		var left_arrow = 37;
		var right_arrow = 39;

		if(e.keyCode === left_arrow) {
			_carouselPrev();
		} else if(e.keyCode === right_arrow)  {
			_carouselNext();
		}
	});
}];
