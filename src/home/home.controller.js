'use strict';

(function() {
    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope'];

    function HomeController($scope) {
        $scope.message = 'Hello AngularJS';
        console.log('xxxxxas')
    }
})();
