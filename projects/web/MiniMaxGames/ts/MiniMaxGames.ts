/**
 * A player that will play a game.
 */
export enum Player {
    Player1,
    Player2
}

/**
 * A game that provides access to a new game board.
 */
export abstract class Game<TGameBoard extends GameBoard> {
    /**
     * Get the name of this game.
     */
    abstract getName(): string;

    /**
     * Get a description of this game.
     */
    abstract getDesc(): string;

    /**
     * Get the board for a new game.
     * @param firstMove The first player to move.
     */
    abstract getNewBoard(firstMove: Player): TGameBoard;
}

/**
 * A board that a game can be played on.
 */
export abstract class GameBoard {

    /**
     * Create a new instance of the GameBoard.
     * @param turn The first player to move.
     */
    constructor(private turn: Player) { }

    /**
     * Get whose turn it is, or null if the game has ended.
     */
    getTurn(): Player {
        return this.turn;
    }

    /**
     * Set whole turn it is.
     * @param player The player whose turn it will be, or null to end the game.
     */
    private setTurn(player: Player): void {
        this.turn = player;
    }

    /**
     * Check if the game has ended.
     */
    isGameOver(): boolean {
        return this.turn === null;
    }

    /**
     * End the game.
     */
    private endGame(): void {
        this.turn = null;
    }

    /**
     * Get a list of available moves for the current player.
     */
    abstract getAvailableMoves(): number[];

    /**
     * Move as the current player on a copy of the current game board.
     * @param move The move the current player wants to make.
     */
    abstract move(move: number): GameBoard;

    /**
     * Get the score for a player.
     * @param forPlayer The player whose score to get.
     */
    abstract getScore(forPlayer: Player): number;

    /**
     * Get a rating of the current board for a player.
     * Used for MiniMax to determine how good the player's position is.
     * @param forPlayer The player whose board position should be rated.
     */
    abstract getBoardValue(forPlayer: Player): number;

    /**
     * Get the board as a HTML string that can be displayed to the user.
     */
    abstract getBoardHtml(): string;

    /**
     * Create a move button that triggers a certain move.
     */
    protected mb(move: number, text: string): string {
        const disabled = this.getAvailableMoves().indexOf(move) < 0;
        return `<button data-mmg-move="${move}" ${disabled ? "disabled" : ""} style="width: 100%; height: 100%;">${text}</button>`;
    }
}
