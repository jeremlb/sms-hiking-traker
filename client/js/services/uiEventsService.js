var angular = require('angular');

module.exports = ['$rootScope', function ($rootScope) {
    var service = {
        addUiListener: addUiListener,
        setPanelListener: setPanelListener,

        openPanel: openPanel,
        refreshUi: refreshUi
    };

    var _uiListeners = []; // to refresh ui
    var _panelListener = null; // to open detail panel

    function addUiListener(callback) {
        if(typeof callback === 'function') {
            _uiListeners.push(callback);
        }
    }

    function setPanelListener(callback) {
        if(typeof callback === 'function') {
            _panelListener = callback;
        }
    }

    function refreshUi() {
        for(var i = 0; i < _uiListeners.length; i+= 1) {
            _uiListeners[i].call(null);
        }
    }

    function openPanel(key) {
        key = key || null;
        console.log(key);
        if(_panelListener !== null && key !== null) {
            _panelListener.call(null, key);
        }
    }

    // when route change remove ui listener destroy when app not displayed
    $rootScope.$on('$routeChangeStart', function (event) {
        // reset listeners
        _uiListeners = [];
        _panelListener = null;
    });

    return service;
}];
