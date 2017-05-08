'use strict';

(function () {
    angular
            .module('app')
            .factory('gameService', gameService);

    gameService.$inject = ['$routeParams'];

    function Player(data) {
        data = data || {};
    }

    function WSClient(data) {
        var self = this;

        data = 'object' === typeof data ? data : {};

        var client = null;

        this.open = function() {
            if (self.isClosed()) {
                client = new WebSocket(data.url, 'echo-protocol');
            }
        };

        this.close = function() {
            if (self.isOpen()) {
                client.close();
            }
        };

        this.on = function(event, callback) {
            if (client) {
                client['on' + event] = callback;
            }
        };

        this.send = function(data) {
            if (self.isOpen()) {
                client.send(data);
            }
        };

        this.isOpen = function() {
            return client && client.OPEN === client.readyState;
        };

        this.isClosed = function() {
            return null === client || client.CLOSED === client.readyState;
        };
    }

    function gameService($routeParams) {
        var data = {};
//        var blocks = [];

        var playerN = null;
        var playerId = $routeParams.pid;

        var client = null;

        function init() {
            client = new WSClient({
                url : 'ws://localhost:8080/?p1=dasdP1'
            });
            client.open();
//            client = new WebSocket('ws://localhost:8080/', 'echo-protocol');

//console.log('-----1')
//for (var i in client) {
//    if ('function' === typeof client[i]) {
//        
//    } else {
//        
//    }
//    console.log(i, typeof client[i])
//}
//console.log('-----2')
//setTimeout(function() {
//    client.close()
//    console.log('CL', client.CLOSED)
//}, 2000)
            client.on('error', function() {
                console.log('Connection Error');
            });

            client.on('open', function(e) {
                console.log('WebSocket Client Connected');
                send({
                    player: playerId
                })
            });

            client.on('close', function(e) {
                console.log('echo-protocol Client Closed');
            });

            client.on('message', function(e) {
                var resp = JSON.parse(e.data)

                if ('start' === resp.type) {
                    data.setPlayerPos(0, 1)
                    data.setPlayerPos(10, 2)

                    playerN = resp.player;

                    data.setOwnTurn(1 == resp.player);

                    data.setLoading(false);
                } else if ('move' === resp.type) {
                    data.setPlayerPos(resp.pos, resp.player)
                } else if ('set_trap' === resp.type) {
                    data.setTrap(resp.pos)
                } else if ('set_enemy_turn' === resp.type) {
                } else if ('set_own_turn' === resp.type) {
                    data.setOwnTurn(true);
                } else if ('game_end' === resp.type) {
                    if ('win' === resp.status) {
                        alert('YOU WON')
                    } else {
                        alert('YOU LOST')
                    }
                    data.endGame();
                }
            });
        }

        function setPlayerPos() {}

        function send(data) {
            if (client.readyState === client.OPEN) {
                var d = JSON.stringify(data);
                client.send(d);
            }
        }

        return {
            init: function (idata) {
                data = idata;
//                blocks = idata.blocks;
                init();
            },
            send: send,
            moveTo: function (index) {
                send({
                    type: 'move',
                    player: playerN,
                    moveTo: index
                });
            },
            setTrap: function (index) {
                send({
                    type: 'set_trap',
                    player: playerN,
                    pos: index
                });
            },
            setEnemyTurn: function () {
                send({
                    type: 'set_enemy_turn',
                });
            },
            lose: function () {
                send({
                    type: 'lose_game',
                });
            },
            win: function () {
                send({
                    type: 'win_game',
                });
            },
            setPlayerPos: setPlayerPos,
            getPlayerN: function () {
                return playerN;
            }
        };
    }
})();
