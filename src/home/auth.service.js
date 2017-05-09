'use strict';

(function() {
    angular
        .module('app')
        .factory('authService', authService);

    authService.$inject = ['$http', 'serverDomain'];

    function authService($http, serverDomain) {
        return {
            login : function(data) {
                return $http.post(serverDomain + 'login', data);
            },
            signup : function(data) {
                return $http.post(serverDomain + 'register', data);
            }
        };
    }
})();
