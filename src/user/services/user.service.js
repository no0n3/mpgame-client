'use strict';

(function() {
    angular
        .module('app')
        .factory('userService', userService);

    userService.$inject = ['$http', 'serverDomain'];

    function userService($http, serverDomain) {
        return {
            get : function(data) {
                return $http.get(serverDomain + 'user', data);
            }
        };
    }
})();
