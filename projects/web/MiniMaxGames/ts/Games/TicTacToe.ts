import {Game, GameBoard, Player} from "../Game";

export class GameTicTacToe extends Game<GameBoardTicTacToe> {
    
    getName(): string {
        return "Tic-Tac-Toe";
    }

    getDesc(): string {
        return "The classic game of X's and O's";
    }

    getNewBoard(firstMove: Player): GameBoardTicTacToe {
        return new GameBoardTicTacToe(firstMove);
    }
}

export class GameBoardTicTacToe extends GameBoard {
    private size = 9;
    private board: Player[] = [];

    constructor(turn: Player) {
        super(turn);
        for (let i = 0; i < 9; i++) {
            this.board[i] = null;
        }
    }

    getAvailableMoves(): number[] {
        const moves: number[] = [];

        // List all empty space moves
        for (let i = 0; this.board[i] !== undefined; i++) {
            if (this.board[i] == null) moves.push(i);
        }

        return moves;
    }

    move(move: number): GameBoard {
        if (this.board[move] != null || this.isGameOver()) return null;

        // Create a new board
        const result = new GameBoardTicTacToe(
            this.getTurn() === Player.Player1
                ? Player.Player2
                : Player.Player1);

        // Clone current board, and move
        result.board = this.board.slice(0);
        result.board[move] = this.getTurn();

        return result;
    }

    getScore(forPlayer: Player): number {
        // Return 1 if the player is the winner, 0 otherwise
        return this.getWinner() === forPlayer ? 1 : 0;
    }

    getBoardValue(forPlayer: Player): number {
        const winner = this.getWinner();

        // If no winner, further in the game is better
        if (winner === null) {
            let score = 0;
            this.board.forEach(value => {
                if (value !== null) score++;
            });
        }

        // If winner, then the score is infinite
        return winner === forPlayer
            ? Number.POSITIVE_INFINITY
            : Number.NEGATIVE_INFINITY;
    }

    private getWinner(): Player {
        const b = this.board;

        // Check rows and cols for winner
        for (let i = 0; i < 3; i++) {
            if ((b[i] === b[i + 1] && b[i] === b[i + 2]) || // Row
                (b[i] === b[i + 3] && b[i] === b[i + 6])) { // Col
                if (b[i] !== null) return b[i];
            }
        }

        // Check diagonals for winner
        if ((b[0] === b[4] && b[0] === b[8]) || // TL -> BR
            (b[2] === b[4] && b[2] === b[6])) { // TR -> BL
            if (b[4] !== null) return b[4];
        }

        // No winner
        return null;
    }

    getBoardHtml(): string {
        const mb = (i: number) => this.mb(i, this.ch(i));

        return `<table style="width: 200px; height: 200px;">
                    <tr><td>${mb(0)}</td><td>${mb(1)}</td><td>${mb(2)}</td></tr>
                    <tr><td>${mb(6)}</td><td>${mb(7)}</td><td>${mb(8)}</td></tr>
                    <tr><td>${mb(3)}</td><td>${mb(4)}</td><td>${mb(5)}</td></tr>
                </table>`;
    }

    /**
     * Helper function that gets an X or an O for a board index.
     * @param i The index in the board to get the character for.
     */
    private ch(i: number): string {
        switch (this.board[i]) {
            case Player.Player1:
                return "X";
            case Player.Player2:
                return "O";
        }
        return " ";
    }
}
