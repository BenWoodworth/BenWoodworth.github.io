﻿import {Game, GameBoard, Player} from "../game";

export class GameMancala extends Game {

    protected createBoard(firstMove: Player): GameBoardMancala {
        return new GameBoardMancala(this, firstMove);
    }

    getName(): string {
        return "Mancala";
    }

    getDesc(): string {
        return "The Kalah variant of Mancala."
    }
}

export class GameBoardMancala extends GameBoard {
    private board: number[] = [];

    constructor(game: Game, turn: Player) {
        super(game, turn);

        this.board[6] = this.board[13] = 0;
        for (let i = 0; i < 6; i++) {
            this.board[i] = this.board[i + 7] = 4;
        }
    }

    getAvailableMoves(): number[] {
        const moves: number[] = [];

        let turnOffset = this.getTurn() ? 0 : 7;
        for (let i = turnOffset; i < turnOffset + 6; i++) {
            if (this.board[i] != 0) moves.push(i);
        }
        return moves;
    }

    move(move: number): GameBoardMancala {
        let newBoard = this.board.slice();
        let newTurn = this.getTurn();

        let skipSpace = this.getTurn() == Player.Player1 ? 13 : 6;

        // Pick up stones
        let stones = newBoard[move];
        newBoard[move] = 0;

        // Drop stones in following spaces
        let curSpace = move;
        while (stones-- > 0) {
            curSpace = (curSpace + 1) % 14;
            if (curSpace == skipSpace) continue;

            newBoard[curSpace]++;
        }

        let sideStart = this.getTurn() == Player.Player1 ? 0 : 7;
        if (curSpace >= sideStart && curSpace < sideStart + 6) { // If landed on own side
            if (newBoard[curSpace] == 0) { // ...and slot is empty
                // ...Take pieces from opposite slot
                let oppositeSlot = 12 - curSpace;
                newBoard[sideStart + 6] += newBoard[oppositeSlot] + 1;
                newBoard[curSpace] = 0;
                newBoard[oppositeSlot] = 0;
            }
        } else if (curSpace != sideStart + 6) { // If didn't land in own Kalah...
            // It's the other player's turn
            newTurn = newTurn == Player.Player1 ? Player.Player2 : Player.Player1;
        }

        // Return a new board
        let result = new GameBoardMancala(this.getGame(), newTurn);
        result.board = newBoard;
        return result;
    }

    getBoardValue(forPlayer: Player): number {
        let slot = forPlayer == Player.Player1 ? 0 : 7;
        let score = this.board[slot] - this.board[7 - slot];

        if (this.isGameOver()) {
            let winner = this.getWinner();
            if (winner == forPlayer) {
                score += 100;
            } else if (winner != forPlayer) {
                score -= 100;
            }
        }

        return score;
    }

    public isGameOver(): boolean {
        for (let i = 0; i < 6; i++) {
            if (this.board[i] != 0) return false;
            if (this.board[i + 7] != 0) return false;
        }
        return true;
    }

    public getWinner(): Player {
        let p1 = this.board[6];
        let p2 = this.board[13];

        if (p1 > p2) {
            return Player.Player1;
        } else if (p1 < p2) {
            return Player.Player2;
        }
        return null; // Tie
    }

    createBoard(container: HTMLElement): void {
        let board = document.createElement("div");
        board.style.width = "100%";
        board.style.height = "0";
        board.style.paddingBottom = "25%";
        board.style.position = "relative";

        // Create divs that will contain the buttons
        let bDivs: HTMLDivElement[] = [];
        for (let i = 0; i < 14; i++) {
            bDivs[i] = document.createElement("div");
            bDivs[i].style.position = "absolute";
            bDivs[i].style.width = "12.5%";
            bDivs[i].style.height = (i % 7 == 6) ? "100%" : "50%";
        }

        // Horizontally align the divs
        bDivs[13].style.left = "0";
        bDivs[0].style.left = bDivs[12].style.left = "12.5%";
        bDivs[1].style.left = bDivs[11].style.left = "25%";
        bDivs[2].style.left = bDivs[10].style.left = "37.5%";
        bDivs[3].style.right = bDivs[9].style.right = "37.5%";
        bDivs[4].style.right = bDivs[8].style.right = "25%";
        bDivs[5].style.right = bDivs[7].style.right = "12.5%";
        bDivs[6].style.right = "0";

        // Vertically align the divs
        for (let i = 0; i < 6; i++) {
            bDivs[i].style.top = "50%";
            bDivs[i + 7].style.top = "0";
        }

        // Add the buttons to the divs
        for (let i = 0; i < 14; i++) {
            let button = this.getGame().createActionButton(i);
            button.style.width = button.style.height = "100%";
            button.innerText = this.board[i].toString();
            board.appendChild(bDivs[i]).appendChild(button);
        }

        // Add the board to the container
        container.appendChild(board);
    }
}