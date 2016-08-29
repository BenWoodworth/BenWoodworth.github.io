import {Game, GameBoard, Player} from "./ts/MiniMaxGames";
import * as TicTacToe from "./ts/Games/TicTacToe";

//import $ = require("./typings/jquery");

class GameView {
    private games: Game<GameBoard>[] = [
        new TicTacToe.GameTicTacToe()
    ];

    curGame: Game<GameBoard> = this.games[0];
    curBoard: GameBoard = this.curGame.getNewBoard(Player.Player1);

    getHtml(): string {
        return this.curGame == null
            ? this.getMenuHtml()
            : this.getBoardHtml();
    }

    private getMenuHtml(): string {
        return `<p>Select a game:</p>
                <p>0) Tic-Tac-Toe</p>`;
    }

    private getBoardHtml(): string {
        return `<p><b>${this.curGame.getName()}</b> - ${this.curGame.getDesc()}</p>
                <p style="font: 'lucida console'">
                    ${this.curBoard.getBoardHtml()}
                </p>`;
    }
}

var content = document.getElementById("content");
var view = new GameView();
content.innerHTML = view.getHtml();

// $("[data-mmg-move]").on("click", () => {
//     var move = $(this).attr("data-mmg-move");
//     alert(move);
// });
