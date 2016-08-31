import {Game, GameBoard, Player} from "../Game";

export class GameTicTacToe extends Game {

    protected createBoard(firstMove: Player) {
        return new GameBoardTicTacToe(this, firstMove);
    }

    getName(): string {
        return "Tic-Tac-Toe";
    }

    getDesc(): string {
        return "The classic game of X's and O's";
    }
}

export class GameBoardTicTacToe extends GameBoard<GameTicTacToe> {
    private board: Player[] = [];

    getAvailableMoves(): number[] {
        const moves: number[] = [];

        // List all empty space moves
        for (let i = 0; i < 9; i++) {
            if (this.board[i] == null) moves.push(i);
        }

        return moves;
    }

    move(move: number): GameBoardTicTacToe {
        if (this.board[move] != null || this.isGameOver()) return null;

        // Create a new board
        const result = new GameBoardTicTacToe(
            this.getGame(),
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

    createBoard(container: HTMLElement): void {
        // Create table
        let table = document.createElement("table");
        let tbody = document.createElement("tbody");
        table.appendChild(tbody);

        // Style the table
        table.style.width = "50vh";
        table.style.height = "50vh";

        // Populate table with buttons
        for (let row = 0; row < 9; row += 3) {
            // Add row and cell to table
            let tr = document.createElement("tr");
            tbody.appendChild(tr);

            for (let col = 0; col < 3; col++) {
                let i = row + col;

                let td = document.createElement("td");
                let text = "";
                if (this.board[i] != null) {
                    text = this.board[i] == Player.Player1 ? "X" : "O";
                }

                let button = this.getGame().createActionButton(row + col, text);
                tbody.appendChild(td).appendChild(button);
            }
        }
    }
}
