var angular = require('angular');

module.exports = ['firebaseService',  'mapService',
     'LxDialogService', '$cookies', 'uiEventsService',
		function (firebaseService, mapService,
          LxDialogService, $cookies, uiEventsService) {

     var _this = this;

     // init
     mapService.onResume(); // init the map when ready
     firebaseService.initFirebase(); // init the firebase connexion

     // album dialog
     this.dialogId = 'album-1';
     this.openAlbum = function () {
          LxDialogService.open(_this.dialogId);
     };

     this.closeAlbum = function () {
          LxDialogService.close(_this.dialogId);
     };

     // open a dialog when it's the first visit and set a cookie
     if($cookies.get('4d7b7ef4-5be4') === undefined) {
          LxDialogService.open('premiere-visite');
          $cookies.put('4d7b7ef4-5be4', true, {
               'expires': new Date("March 8, 2100 17:05:00")
          });
     }
}];
