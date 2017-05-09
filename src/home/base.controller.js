'use strict';

(function() {
    angular
        .module('app')
        .controller('BaseController', BaseController);

    BaseController.$inject = ['$rootScope'];

    function BaseController($rootScope, $scope) {
        console.log('IN BASE CONTROLLER')
    }
})();
