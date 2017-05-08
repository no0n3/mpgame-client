'use strict';

(function () {
    angular
            .module('app')
            .controller('GameController', GameController);

    GameController.$inject = ['$scope', 'gameService'];

    function GameController($scope, gameService) {
        $scope.loading = true;
        $scope.ownTurn = false;
        $scope.trapStatus = null;

        var rolled = false;

        var canRollAgain = false;

        $scope.blocks = [];
        for (var i = 0; i < 20; i++) {
            $scope.blocks.push({
                dark: false
            })
        }

        gameService.init({
            blocks: $scope.blocks,
            setLoading: function (loading) {
                $scope.$apply(function () {
                    $scope.loading = loading ? true : false;
                });
            },
            setPlayerPos: function (pos, pid) {
                $scope.$apply(function () {
                    setPlayerPos(pos, pid)
                })
            },
            setTrap: function (pos) {
                $scope.$apply(function () {
                    $scope.blocks[pos].dark = true;
                    $scope.trapStatus = null;
                })
            },
            setOwnTurn: function (ownTurn) {
                $scope.$apply(function () {
                    $scope.ownTurn = ownTurn;
                })
            },
            endGame: function () {
                $scope.$apply(function () {
                    $scope.endGame = true;
                })
            }

        });

        var playerPosA = {1: 0, 2: 10};

        function setPlayerPos(newPos, player) {
            // player = player || 2;
            console.log('set player ', player, ' pos to ', newPos)
            var playerPos = playerPosA[player];

            $scope.blocks[playerPos].hasPlayer = false;
            $scope.blocks[playerPos]['player' + player] = false;

            playerPosA[player] = newPos;
            playerPos = newPos;

            $scope.blocks[playerPos].hasPlayer = true;
            $scope.blocks[playerPos]['player' + player] = true;

            if ($scope.blocks[playerPos].dark) {
                gameService.lose();
            } else if ($scope.blocks[playerPos]['player' + (1 == player ? 2 : 1)]) {
                gameService.win();
            }
        }

        $scope.blockClick = function () {
            if (false === $scope.ownTurn) {
                return;
            }

            if ('setting' === $scope.trapStatus) {
                var b = true;

                for (var i in playerPosA) {
                    if (this.$n == playerPosA[i]) {
                        b = false;
                        break;
                    }
                }

                if (b) {
                    gameService.setTrap(this.$n)
                    rolled = false;
                } else {
                    alert('cannot set trap on player position')
                }
            } else {
                var b = false;
                for (var i in targetPosA) {
                    if (this.$n == targetPosA[i]) {
                        b = true;
                        break;
                    }
                }

                if (false === b) {
                    return;
                }

                gameService.moveTo(this.$n)
                $scope.trapStatus = null;
                if (false == canRollAgain) {
                    $scope.ownTurn = false;
                    gameService.setEnemyTurn()
                }
                rolled = false;
            }
        }

        $scope.setTrap = function () {
            if ('can_set' === $scope.trapStatus) {
                $scope.trapStatus = 'setting';
            }
        };
        $scope.cancelTrap = function () {
            if ('setting' === $scope.trapStatus) {
                $scope.trapStatus = 'can_set';
            }
        };

        var targetPos = null;
        var targetPosA = [];

        $scope.rollDice = function () {
            if (false === $scope.ownTurn || true === rolled) {
                console.log('No roll')
                console.log($scope.ownTurn, rolled)
                return;
            }
            console.log('DICE ROLL')
            $scope.diceResult = roll();
            var playerPos = playerPosA[gameService.getPlayerN()];
            var pos = playerPos;
            if (0 > playerPos - $scope.diceResult) {
                targetPosA[0] = pos = $scope.blocks.length - Math.abs(playerPos - $scope.diceResult)
            } else {
                targetPosA[0] = pos = playerPos - $scope.diceResult
            }

            if ($scope.blocks.length <= playerPos + $scope.diceResult) {
                targetPosA[1] = Math.abs(playerPos + $scope.diceResult) - $scope.blocks.length;
            } else {
                targetPosA[1] = playerPos + $scope.diceResult
            }

            gameService.send({
                diceRoll: $scope.diceResult
            })
            targetPos = pos;
            rolled = true;

            if (6 === $scope.diceResult) {
                $scope.trapStatus = 'can_set';
                canRollAgain = true;
            } else {
                canRollAgain = false;
            }
        }

        function roll() {
            var n = getRandNumber(6);
            if (n <= 2 && getRandNumber(3) <= 2) {
                n = getRandNumber(6);
            }

            return n;
        }

        function getRandNumber(max) {
            var n = Math.floor((Math.random() * max) + 1);

            return n;
        }
    }
})();
