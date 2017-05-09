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
            .when('/login', {
                templateUrl: 'home/login/login.html',
                controller: 'LoginController'
            })
            .when('/sign-up', {
                templateUrl: 'home/signup/signup.html',
                controller: 'SignupController'
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
