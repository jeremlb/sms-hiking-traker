module.exports = [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            attrs.$set("deferredCloak", undefined);
            element.removeClass("deferred-cloak");
        }
    };
}];
