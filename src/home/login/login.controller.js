'use strict';

(function() {
    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', 'authService'];

    function LoginController($scope, authService) {
        $scope.loading = false;
        $scope.user = {};

        $scope.login = function(form) {
            if (form.email.$valid, form.password.$valid) {
                $scope.loading = true;

                authService
                    .login({
                        email : $scope.user.email,
                        password : $scope.user.password
                    })
                    .then(function(resp) {
                        $scope.loading = false;
                        console.log(resp)
                    }, function() {
                        $scope.loading = false;
                    });
            }
        };
    }
})();
