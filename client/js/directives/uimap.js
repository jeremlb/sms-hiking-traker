module.exports = ['mapManagerService', function (mapManagerService) {
    return {
        restrict: 'A',
        scope: {},
        template: '<div class="map-canvas"></div>',
        link: function (scope, element, attrs, controller) {
            if(mapManagerService.hasElement()) {
                element.replaceWith(mapManagerService.getElement());
            } else {
                mapManagerService.setElement(element.children()[0]);
            }
        }
    };
}];
