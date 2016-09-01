import {Game, GameBoard, Player} from "../game";

export class GameTicTacToe extends Game {

    protected createBoard(firstMove: Player): GameBoardTicTacToe {
        return new GameBoardTicTacToe(this, firstMove);
    }

    getName(): string {
        return "Tic-Tac-Toe";
    }

    getDesc(): string {
        return "The classic game of X's and O's";
    }
}

export class GameBoardTicTacToe extends GameBoard {
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
        // If no winner, further in the game is better
        const gameOver = this.isGameOver();
        const winner = this.getWinner();

        // Further into the game is better
        let score = 0;
        this.board.forEach(value => {
            if (value != null) score++;
        });
        
        // Winning later is better (rubbing it in)
        if (gameOver && !this.isTie()) {
            score += 1000;
            if (winner != forPlayer) {
                score *= -1;
            }
        }

        return score;
    }

    public isGameOver(): boolean {
        if (this.getWinner() != null) return true; 
        for (let i = 0; i < 9; i++) {
            if (this.board[i] == null) return false;
        }
        return true;
    }

    public getWinner(): Player {
        const b = this.board;

        // Check rows and cols for winner
        for (let i = 0; i < 3; i++) {
            let r = i * 3;
            if ((b[r] == b[r + 1] && b[r] == b[r + 2]) || // Row
                (b[i] == b[i + 3] && b[i] == b[i + 6])) { // Col

                let sp = 4 * i; // Intersection between row/col
                if (b[sp] != null) return b[sp];
            }
        }

        // Check diagonals for winner
        if ((b[0] == b[4] && b[0] == b[8]) || // TL -> BR
            (b[2] == b[4] && b[2] == b[6])) { // TR -> BL

            if (b[4] != null) return b[4];
        }

        // No winner yet
        return null;
    }

    createBoard(container: HTMLElement): void {
        let board = document.createElement("div");
        board.style.position = "relative";
        board.style.width = "100%";
        board.style.height = "100%";
        container.appendChild(board);
        
        let bDivs: HTMLDivElement[] = [];
        for (let i = 0; i < 9; i++) {
            bDivs[i] = document.createElement("div");
            bDivs[i].style.position = "absolute";

            let button = this.getGame().createActionButton(i);
            button.style.width = button.style.height = "100%";
            button.style.fontSize = "1in";
            if (this.board[i] != null) {
                button.textContent = this.board[i] == Player.Player1 ? "X" : "O";
            }
            
            board.appendChild(bDivs[i]).appendChild(button);
        }

        const third = "33%";
        for (let i = 0; i < 3; i++) {
            // Align top row and left column
            bDivs[i].style.top = "0";
            bDivs[i].style.height = third;
            bDivs[i * 3].style.left = "0";
            bDivs[i * 3].style.width = third;

            // Align middle row and column
            bDivs[i + 3].style.top = third;
            bDivs[i + 3].style.bottom = third;
            bDivs[i * 3 + 1].style.left = third;
            bDivs[i * 3 + 1].style.right = third;

            // Align bottom row and right column
            bDivs[i + 6].style.bottom = "0";
            bDivs[i + 6].style.height = third;
            bDivs[i * 3 + 2].style.right = "0";
            bDivs[i * 3 + 2].style.width = third;
        }
    }
}
