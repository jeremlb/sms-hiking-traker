var template = require('ngtemplate!html!./templates/panel.html');

module.exports = [function () {

    return {
        restrict: 'A',
        templateUrl: template,
        controllerAs: 'panelCtrl',
        controller: 'PanelCtrl',
        link: function (scope, element, attrs, controller) {}
    };
}];
