var angular = require('angular');

module.exports = ['$window', '$rootScope', function ($window, $rootScope) {
        var sidebarIsShown = false;
        var _listeners = {};
        var service = {
            toggleSidebar : toggleSidebar,
            hideSidebar: hideSidebar,
			openSidebar: openSidebar,
            isSidebarShown : isSidebarShown,
            addListener: addListener,
			hasListener: hasListener,
			removeListener: removeListener
        };

        function toggleSidebar() {
            sidebarIsShown = !sidebarIsShown;
            notify(sidebarIsShown);
        }

        function isSidebarShown() {
            return sidebarIsShown;
        }

        function hideSidebar() {
            if(sidebarIsShown === true) {
                sidebarIsShown = false;
                notify();
            }
        }

		function openSidebar() {
			if(sidebarIsShown === false) {
                sidebarIsShown = true;
                notify();
            }
		}

        function addListener(id, callback) {
            if(typeof callback === 'function') {
                if(!_listeners.hasOwnProperty(id)) {
                    _listeners[id] = callback;
                    return true;
                }
            }

            return false;
        }

		function removeListener(id) {
			if(_listeners.hasOwnProperty(id)) {
				delete _listeners[id];
				return true;
			}
			return false;
		}

		function hasListener(id) {
			return _listeners.hasOwnProperty(id);
		}

        function notify() {
            for(var key in _listeners) {
                _listeners[key](sidebarIsShown);
            }

            if($rootScope.$root.$$phase !== '$apply' && $rootScope.$root.$$phase !== '$digest') {
                $rootScope.$digest();
            }
        }

        // hide the sidebar on resize if open
        var w = angular.element($window);
        w.bind('resize', function () {
            if(sidebarIsShown === true) {
                sidebarIsShown = false;
                notify();
            }
        });

        return service;
    }];
