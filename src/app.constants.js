'use strict';

(function() {
    angular
        .module('app')
        .constant('serverDomain', 'http://localhost/mpgame/server/public/')
        .constant('wsServerDomain', 'ws://localhost:8080/');
})();
