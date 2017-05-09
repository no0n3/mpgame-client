'use strict';

(function() {
    angular
        .module('app')
        .factory('authService', authService);

    authService.$inject = ['$http', 'serverDomain'];

    function authService($http, serverDomain) {
        return {
            login : function(data) {
                console.log('serverDomain', serverDomain)
                return $http.post(serverDomain + 'login', data);
            }
        };
    }
})();
