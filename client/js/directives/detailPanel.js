var template = require('ngtemplate!html!./detailPanel.html');

module.exports = [function () {

    return {
        restrict: 'A',
        templateUrl: template,
        link: function (scope, element, attrs, controller) {}
    };
}];
