'use strict';

(function() {
    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$rootScope', '$scope', '$controller'];

    function HomeController($rootScope, $scope, $controller) {
        angular.extend(this, $controller('BaseController', {$scope: $scope}));
//        $scope.msg = 'Hello ' + $rootScope.user.email;
    }
})();
