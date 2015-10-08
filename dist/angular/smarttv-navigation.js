(function(window, angular) {
    var app = angular.module('smarttvNavigation', ['ng']);
    var keyCodes = navigation.getKeyMapping();
    var events = [];

    for (var i = 0; i < keyCodes.length; i++) {
        var eventName = keyCodes[i][1];
        if(events.indexOf(eventName) == -1){
            events.push(eventName);
        }
    }

    angular.forEach(events, function (eventName) {
        var dirName = 'nv' + (eventName.substring(0, 1).toUpperCase() + eventName.substr(1));
        app.directive(dirName, function () {
            return {
                restrict: 'A',
                link: function(scope, element, attrs, controller){
                    element.bind( 'nv-' + eventName, function (event) {
                        scope.$apply(function(){
                            scope.$eval(attrs[dirName], {'event': event});
                        });
                    });

                    if(eventName == 'enter'){
                        element.bind('click', function (event) {
                            scope.$eval(attrs[dirName], {'event': event});
                        });
                    }
                }
            }
        });
    });


    NavigationElement.$inject = ['$log', '$timeout'];
    function NavigationElement($log, $timeout){
        return {
            restrict: 'A',
            link: function(scope, element) {
                // wait set attr
                $timeout(function () {
                    navigation.addElement(element[0]);
                });

                scope.$on('$destroy', function () {
                    // TODO: remove element from navigation scope
                    navigation.removeElement(element[0]);
                });
            }
        };
    };


    NavigationScope.$inject = ['$log', '$timeout'];
    function NavigationScope($log, $timeout){
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var nvScopeName = attrs.nvScope;
                scope.$on("$destroy", function () {
                    navigation.removeScope(nvScopeName);
                });
            }
        };
    };


    app.directive('nvScope', NavigationScope)
        .directive('nvEl', NavigationElement)
})(window, window.angular);