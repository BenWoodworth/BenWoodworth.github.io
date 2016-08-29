var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("ts/MiniMaxGames", ["require", "exports"], function (require, exports) {
    "use strict";
    (function (Player) {
        Player[Player["Player1"] = 0] = "Player1";
        Player[Player["Player2"] = 1] = "Player2";
    })(exports.Player || (exports.Player = {}));
    var Player = exports.Player;
    var Game = (function () {
        function Game() {
        }
        return Game;
    }());
    exports.Game = Game;
    var GameBoard = (function () {
        function GameBoard(turn) {
            this.turn = turn;
        }
        GameBoard.prototype.getTurn = function () {
            return this.turn;
        };
        GameBoard.prototype.setTurn = function (player) {
            this.turn = player;
        };
        GameBoard.prototype.isGameOver = function () {
            return this.turn === null;
        };
        GameBoard.prototype.endGame = function () {
            this.turn = null;
        };
        GameBoard.prototype.mb = function (move, text) {
            var disabled = this.getAvailableMoves().indexOf(move) < 0;
            return "<button class=\"mmg-move-button\" data-mmg-move=\"" + move + "\"\n                " + (disabled ? "disabled" : "") + " style=\"width: 100%; height: 100%;\">" + text + "</button>";
        };
        return GameBoard;
    }());
    exports.GameBoard = GameBoard;
});
define("ts/Games/TicTacToe", ["require", "exports", "ts/MiniMaxGames"], function (require, exports, MiniMaxGames) {
    "use strict";
    var Game = MiniMaxGames.Game;
    var GameBoard = MiniMaxGames.GameBoard;
    var Player = MiniMaxGames.Player;
    var GameTicTacToe = (function (_super) {
        __extends(GameTicTacToe, _super);
        function GameTicTacToe() {
            _super.apply(this, arguments);
        }
        GameTicTacToe.prototype.getName = function () {
            return "Tic-Tac-Toe";
        };
        GameTicTacToe.prototype.getDesc = function () {
            return "The classic game of X's and O's";
        };
        GameTicTacToe.prototype.getNewBoard = function (firstMove) {
            return new GameBoardTicTacToe(firstMove);
        };
        return GameTicTacToe;
    }(Game));
    exports.GameTicTacToe = GameTicTacToe;
    var GameBoardTicTacToe = (function (_super) {
        __extends(GameBoardTicTacToe, _super);
        function GameBoardTicTacToe(turn) {
            _super.call(this, turn);
            this.size = 9;
            this.board = [];
            for (var i = 0; i < 9; i++) {
                this.board[i] = null;
            }
        }
        GameBoardTicTacToe.prototype.getAvailableMoves = function () {
            var moves = [];
            for (var i = 0; this.board[i] !== undefined; i++) {
                if (this.board[i] == null)
                    moves.push(i);
            }
            return moves;
        };
        GameBoardTicTacToe.prototype.move = function (move) {
            if (this.board[move] != null || this.isGameOver())
                return null;
            var result = new GameBoardTicTacToe(this.getTurn() === Player.Player1
                ? Player.Player2
                : Player.Player1);
            result.board = this.board.slice(0);
            result.board[move] = this.getTurn();
            return result;
        };
        GameBoardTicTacToe.prototype.getScore = function (forPlayer) {
            return this.getWinner() === forPlayer ? 1 : 0;
        };
        GameBoardTicTacToe.prototype.getBoardValue = function (forPlayer) {
            var winner = this.getWinner();
            if (winner === null) {
                var score_1 = 0;
                this.board.forEach(function (value) {
                    if (value !== null)
                        score_1++;
                });
            }
            return winner === forPlayer
                ? Number.POSITIVE_INFINITY
                : Number.NEGATIVE_INFINITY;
        };
        GameBoardTicTacToe.prototype.getWinner = function () {
            var b = this.board;
            for (var i = 0; i < 3; i++) {
                if ((b[i] === b[i + 1] && b[i] === b[i + 2]) ||
                    (b[i] === b[i + 3] && b[i] === b[i + 6])) {
                    if (b[i] !== null)
                        return b[i];
                }
            }
            if ((b[0] === b[4] && b[0] === b[8]) ||
                (b[2] === b[4] && b[2] === b[6])) {
                if (b[4] !== null)
                    return b[4];
            }
            return null;
        };
        GameBoardTicTacToe.prototype.getBoardHtml = function () {
            var _this = this;
            var mb = function (i) { return _this.mb(i, _this.ch(i)); };
            return "<table style=\"width: 200px; height: 200px;\">\n                    <tr><td>" + mb(0) + "</td><td>" + mb(1) + "</td><td>" + mb(2) + "</td></tr>\n                    <tr><td>" + mb(6) + "</td><td>" + mb(7) + "</td><td>" + mb(8) + "</td></tr>\n                    <tr><td>" + mb(3) + "</td><td>" + mb(4) + "</td><td>" + mb(5) + "</td></tr>\n                </table>";
        };
        GameBoardTicTacToe.prototype.ch = function (i) {
            switch (this.board[i]) {
                case Player.Player1:
                    return "X";
                case Player.Player2:
                    return "O";
            }
            return " ";
        };
        return GameBoardTicTacToe;
    }(GameBoard));
    exports.GameBoardTicTacToe = GameBoardTicTacToe;
});
define("app", ["require", "exports", "ts/MiniMaxGames", "ts/Games/TicTacToe"], function (require, exports, MiniMaxGames, TicTacToe) {
    "use strict";
    var Player = MiniMaxGames.Player;
    var GameView = (function () {
        function GameView() {
            this.games = [
                new TicTacToe.GameTicTacToe()
            ];
            this.curGame = this.games[0];
            this.curBoard = this.curGame.getNewBoard(Player.Player1);
        }
        GameView.prototype.getHtml = function () {
            return this.curGame == null
                ? this.getMenuHtml()
                : this.getBoardHtml();
        };
        GameView.prototype.getMenuHtml = function () {
            return "<p>Select a game:</p>\n                <p>0) Tic-Tac-Toe</p>";
        };
        GameView.prototype.getBoardHtml = function () {
            return "<p><b>" + this.curGame.getName() + "</b> - " + this.curGame.getDesc() + "</p>\n                <p style=\"font: 'lucida console'\">\n                    " + this.curBoard.getBoardHtml() + "\n                </p>";
        };
        return GameView;
    }());
    var content = document.getElementById("content");
    var view = new GameView();
    content.innerHTML = view.getHtml();
});
