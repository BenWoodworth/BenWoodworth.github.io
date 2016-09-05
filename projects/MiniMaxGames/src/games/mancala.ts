import {Game, GameBoard, Player} from "../game";

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

        let turnOffset = this.getTurn() == Player.Player1 ? 0 : 7;
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
        while (stones > 0) {
            curSpace = (curSpace + 1) % 14;
            if (curSpace == skipSpace) continue;

            newBoard[curSpace]++;
            stones--;
        }

        // If landed in empty space on own side, and opposite space not empty, take pieces
        let sideStart = this.getTurn() == Player.Player1 ? 0 : 7;
        if (curSpace >= sideStart && curSpace <= sideStart + 5) {
            let oppositeSpace = 12 - curSpace;
            if (newBoard[curSpace] == 1 && newBoard[oppositeSpace] != 0) {
                newBoard[sideStart + 6] += newBoard[oppositeSpace] + 1;
                newBoard[oppositeSpace] = 0;
                newBoard[curSpace] = 0;
            }
        }
        
        // Other player's turn if didn't land in own Kalah
        if (curSpace != sideStart + 6) {
            newTurn = this.getTurn() == Player.Player1 ? Player.Player2 : Player.Player1;
        }

        // Check if there's a side with no pieces, which would end the game
        let hasPieces1 = false, hasPieces2 = false;
        for (let i = 0; i < 6; i++) {
            hasPieces1 = hasPieces1 || newBoard[i] != 0;
            hasPieces2 = hasPieces2 || newBoard[i + 7] != 0;
        }
        if (!hasPieces1 || !hasPieces2) {
            let nonEmptySideStart = hasPieces1 ? 0 : 7;
            let kalah = (nonEmptySideStart + 13) % 14;
            for (let i = nonEmptySideStart; i < nonEmptySideStart + 6; i++) {
                newBoard[kalah] += newBoard[i];
                newBoard[i] = 0;
            }
            newTurn = null; // End game
        }

        // Return a new board
        let result = new GameBoardMancala(this.getGame(), newTurn);
        result.board = newBoard;
        return result;
    }

    getBoardValue(forPlayer: Player): number {
        // Calculate board score for player 1
        let score = this.board[6] - this.board[13];
        if (this.isGameOver() && this.getWinner() != null) {
            let winner = this.getWinner();
            if (winner == Player.Player1) {
                score += 100;
            } else if (winner != forPlayer) {
                score -= 100;
            }
        }

        // Negate score if forPlayer is player 2
        if (forPlayer == Player.Player2) {
            score *= -1;
        }
        
        return score;
    }

    public isGameOver(): boolean {
        return this.getTurn() == null;
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
            bDivs[i].style.padding = "1px";
            bDivs[i].style.boxSizing = "border-box";
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
            bDivs[i].style.bottom = "0";
            bDivs[i + 7].style.top = "0";
        }

        // Add the buttons to the divs
        for (let i = 0; i < 14; i++) {
            let button = this.getGame().createActionButton(i);
            button.style.width = button.style.height = "100%";
            let amount = this.board[i];
            button.innerText = amount == 0 ? "" : amount.toString();
            board.appendChild(bDivs[i]).appendChild(button);
        }

        // Add the board to the container
        container.appendChild(board);
    }
}
