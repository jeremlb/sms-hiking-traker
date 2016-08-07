var angular = require('angular');

module.exports = [function () {
    var service = {
        setUiListener: setUiListener,
        setPanelListener: setPanelListener,

        openPanel: openPanel,
        refreshUi: refreshUi
    };

    var _uiListener = null; // to refresh ui
    var _panelListener = null; // to open detail panel

    function setUiListener(callback) {
        if(typeof callback === 'function') {
            _uiListener = callback;
        }
    }

    function setPanelListener(callback) {
        if(typeof callback === 'function') {
            _panelListener = callback;
        }
    }

    function refreshUi() {
        if(_uiListener !== null) {
            _uiListener.call(null);
        }
    }

    function openPanel(key) {
        key = key || null;
        console.log(key);
        if(_panelListener !== null && key !== null) {
            _panelListener.call(null, key);
        }
    }

    return service;
}];
