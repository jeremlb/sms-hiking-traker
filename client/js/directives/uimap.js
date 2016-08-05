module.exports = ['mapManagerService', function (mapManagerService) {
    return {
        restrict: 'A',
        scope: {},
        template: '<div style="height:100%;width:100%;"></div>',
        link: function (scope, element, attrs, controller) {
            if(mapManagerService.hasElement()) {
                element.replaceWith(mapManagerService.getElement());
            } else {
                element.css('height', '100%');
                element.css('width', '100%');

                mapManagerService.setElement(element.children()[0]);
            }
        }
    };
}];
