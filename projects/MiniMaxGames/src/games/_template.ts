import {Game, GameBoard, Player} from "../game";

export class GameNAME extends Game {

    protected createBoard(firstMove: Player): GameBoardNAME {
        return new GameBoardNAME(this, firstMove);
    }

    getName(): string {
        return null; // TODO
    }

    getDesc(): string {
        return null; // TODO
    }
}

export class GameBoardNAME extends GameBoard {
    //private board: ?[] = [];

    getAvailableMoves(): number[] {
        const moves: number[] = [];
        return null; // TODO
    }

    move(move: number): GameBoardNAME {
        return null; // TODO
    }

    getBoardValue(forPlayer: Player): number {
        return null; // TODO
    }

    public isGameOver(): boolean {
        return null; // TODO
    }

    public getWinner(): Player {
        return null; // TODO
    }

    createBoard(container: HTMLElement): void {
        return null; // TODO
    }
}
