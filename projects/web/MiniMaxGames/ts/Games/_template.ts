import {Game, GameBoard, Player} from "../MiniMaxGames";

export class GameNAME extends Game<GameBoardNAME> {

    getName(): string {
        // TODO
        return null;
    }
    
    getDesc(): string {
        // TODO
        return null;
    }
    
    getNewBoard(firstMove: Player): GameBoardNAME {
        // TODO
        return null;
    }
}

export class GameBoardNAME extends GameBoard {

    getAvailableMoves(): number[] {
        // TODO
        return null;
    }

    move(move: number): GameBoard {
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

    getBoardHtml(): string {
        // TODO
        return null;
    }
}
