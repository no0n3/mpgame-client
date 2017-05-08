'use strict';

(function() {
    angular
        .module('app', ['ngRoute', ])
        .config(config);

    config.$inject = ['$routeProvider', '$locationProvider'];

    function config ($routeProvider, $locationProvider) {
        $locationProvider
            .hashPrefix('');

        $routeProvider
            .when('/', {
                templateUrl: 'home/home.html',
                controller: 'HomeController'
            })
            .when('/game', {
                templateUrl: 'game/game.html',
                controller: 'GameController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();
