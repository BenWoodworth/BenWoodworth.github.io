import {Game, GameBoard, Player} from "../Game";

export class GameNAME extends Game {

    protected createBoard(firstMove: Player) {
        return new GameBoardNAME(this, firstMove);
    }

    getName(): string {
        // TODO
        return null;
    }

    getDesc(): string {
        // TODO
        return null;
    }
}

export class GameBoardNAME extends GameBoard<GameNAME> {
    private board: Player[] = [];

    getAvailableMoves(): number[] {
        // TODO
        return null;
    }

    move(move: number): GameBoardNAME {
        // TODO
        return null;
    }

    getScore(forPlayer: Player): number {
        // TODO
        return null;
    }

    getBoardValue(forPlayer: Player): number {
        // TODO
        return null;
    }

    private getWinner(): Player {
        // TODO
        return null;
    }

    createBoard(container: HTMLElement): void {
        // TODO
    }
}
