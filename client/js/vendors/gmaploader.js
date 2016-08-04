/*
 !
 The MIT License
 Copyright (c) 2010-2013 Google, Inc. http://angularjs.org
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the 'Software'), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 angular-google-maps
 https://github.com/angular-ui/angular-google-maps
 @authors
 Nicolas Laplante - https://plus.google.com/108189012221374960701
 Nicholas McCready - https://twitter.com/nmccready
 */

var angular = require('angular');

'use strict';

/*
    Utils functions to load Google Maps API
 */

 function isKeyInArray(key, arraycompare) {
     var status = false;
     for(var i = 0; i < arraycompare.length && status === false; i += 1) {
         if(arraycompare[i] === key) {
             status = true;
         }
     }

     return status;
 }

var utils = (function () {
    function generateOptions(options, omit) {
        var params = [];
        for(var option in options) {
            if(isKeyInArray(option, omit) === false) {
                params.push(option + '=' + options[option]);
            }
        }

        return params;
    }

    return {
        generateOptions: generateOptions
    };
})();

function MapServiceException(message) {
    this.message = message;
    this.name = 'MapServiceException';
};

var gmaploader = angular.module('gmaploader', []).factory('uiGmapMapScriptLoader', [
    '$q', 'uiGmapuuid', function($q, uuid) {
        var getScriptUrl, includeScript, isGoogleMapsLoaded, scriptId;
        scriptId = void 0;
        getScriptUrl = function(options) {
            if (options.china) {
                return 'http://maps.google.cn/maps/api/js?';
            } else {
                if (options.transport === 'auto') {
                    return '//maps.googleapis.com/maps/api/js?';
                } else {
                    return options.transport + '://maps.googleapis.com/maps/api/js?';
                }
            }
        };
        includeScript = function(options) {
            var omitOptions, query, script;
            omitOptions = ['transport', 'isGoogleMapsForWork', 'china'];
            if (options.isGoogleMapsForWork) {
                omitOptions.push('key');
            }
            query = utils.generateOptions(options, omitOptions);

            if (scriptId) {
                document.getElementById(scriptId).remove();
            }
            query = query.join('&');
            script = document.createElement('script');
            script.id = scriptId = 'ui_gmap_map_load_' + (uuid.generate());
            script.type = 'text/javascript';
            script.src = getScriptUrl(options) + query;
            return document.body.appendChild(script);
        };
        isGoogleMapsLoaded = function() {
            return angular.isDefined(window.google) && angular.isDefined(window.google.maps);
        };
        return {
            load: function(options) {
                var deferred, randomizedFunctionName;
                deferred = $q.defer();
                if (isGoogleMapsLoaded()) {
                    deferred.resolve(window.google.maps);
                    return deferred.promise;
                }
                randomizedFunctionName = options.callback = 'onGoogleMapsReady' + Math.round(Math.random() * 1000);
                window[randomizedFunctionName] = function() {
                    window[randomizedFunctionName] = null;
                    deferred.resolve(window.google.maps);
                };
                if (window.navigator.connection && window.Connection && window.navigator.connection.type === window.Connection.NONE) {
                    document.addEventListener('online', function() {
                        if (!isGoogleMapsLoaded()) {
                            return includeScript(options);
                        }
                    });
                } else {
                    includeScript(options);
                }
                return deferred.promise;
            }
        };
    }
]);

gmaploader.provider('uiGmapGoogleMapApi', function() {
    this.options = {
        transport: 'https',
        isGoogleMapsForWork: false,
        china: false,
        v: '3',
        libraries: '',
        language: 'fr'
    };
    this.configure = function(options) {
        angular.extend(this.options, options);
    };
    this.$get = [
        'uiGmapMapScriptLoader', (function(_this) {
            return function(loader) {
                return loader.load(_this.options);
            };
        })(this)
    ];
    return this;
});

gmaploader.service('uiGmapuuid', function() {
    /*
     Version: core-1.0
     The MIT License: Copyright (c) 2012 LiosK.
     */
    function UUID(){}UUID.generate=function(){var a=UUID._gri,b=UUID._ha;return b(a(32),8)+'-'+b(a(16),4)+'-'+b(16384|a(12),4)+'-'+b(32768|a(14),4)+'-'+b(a(48),12)};UUID._gri=function(a){return 0>a?NaN:30>=a?0|Math.random()*(1<<a):53>=a?(0|1073741824*Math.random())+1073741824*(0|Math.random()*(1<<a-30)):NaN};UUID._ha=function(a,b){for(var c=a.toString(16),d=b-c.length,e='0';0<d;d>>>=1,e+=e)d&1&&(c=e+c);return c};
    return UUID;
});

gmaploader.service('uiGmapManager', ['$q', 'uiGmapGoogleMapApi', function ($q, uiGmapGoogleMapApi) {
    var service = {
        isMapReady: isMapReady,
        onReady: onReady,
        createMap: createMap,
        getMap: getMap,
        hasElement: hasElement,
        setElement: setElement,
        getElement: getElement
    };

    var _isMapReady = false;
    var _waitingForDirective = false;

    var _map = null;
    var _element = null;
    var _callbackMapReadyListener = [];
    var _callbackCreateMapListener = [];

    uiGmapGoogleMapApi.then(function(maps) {
        _isMapReady = true;

        for(var i = 0; i < _callbackMapReadyListener.length; i += 1) {
            _callbackMapReadyListener[i](maps);
        }

        _callbackMapReadyListener = [];
    });

    function isMapReady () {
        return _isMapReady;
    }

    function onReady() {
        var deferred = $q.defer();

        if(_isMapReady === true) {
            deferred.resolve(_map);
        } else {
            _callbackMapReadyListener.push(function () {
                deferred.resolve();
            });
        }

        return deferred.promise;
    }

    function createMap(mapOptions) {
        var deferred = $q.defer();

        _callbackCreateMapListener.push(function (_map) {
            deferred.resolve(_map);
        });

        if(_element !== null) {
            if(_map === null) {
                _map = new google.maps.Map(_element, mapOptions);
            } else {
                _map.setOptions(mapOptions);
            }

            for(var i = 0; i < _callbackCreateMapListener.length; i += 1) {
                _callbackCreateMapListener[i](_map);
            }
            _callbackCreateMapListener = [];

        } else {
            _waitingForDirective = true;
        }

        return deferred.promise;
    }

    function setElement(element) {
        if(_element === null) {
            _element = element;
            return service;
        }

        throw new MapServiceException('Un seul element peut être créé');
    }

    function hasElement() {
        return (_element !== null);
    }

    function getElement() {
        return _element;
    }

    function getMap() {
        return _map;
    }

    return service;
}]);

module.exports = 'gmaploader';
