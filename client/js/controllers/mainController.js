var angular = require('angular');

module.exports = ['sidebarService', '$cookies',
		function (sidebarService, $cookies) {

     var _this = this;

     var _show_progress = true;

	 var _isSidebarShown = false;
	 var _sidebarListenerId = 'mainctrl';

	 this.icon = 'menu'; // icon for the loading

	 // sidebar management
	 function _sidebarListener (value) {
		 console.log('toggle', value);
		 _isSidebarShown = value;

		 if(_isSidebarShown === true) {
			 _this.icon = 'arrow-left-bold';
		 } else {
			 _this.icon = 'menu';
		 }
	 }

	 // ui sidebar management
	 this.sidebarButonEvent = function() {
		 console.log('togle event');
		 sidebarService.toggleSidebar();
	 };

	 this.isSidebarShown = function () {
		 return _isSidebarShown;
	 };

	 // init the listener for sidebar navigation
	 if(sidebarService.hasListener(_sidebarListenerId)) {
		 sidebarService.removeListener(_sidebarListenerId, _sidebarListener);
	 }

	 sidebarService.addListener(_sidebarListenerId, _sidebarListener);

     // open a dialog when it's the first visit and set a cookie
     if($cookies.get('4d7b7ef4-5be4') === undefined) {
          LxDialogService.open('premiere-visite');
          $cookies.put('4d7b7ef4-5be4', true, {
               'expires': new Date("March 8, 2100 17:05:00")
          });
     }
}];
