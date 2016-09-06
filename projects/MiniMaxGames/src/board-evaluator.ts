import {GameBoard, Player} from "./game";

interface Move {
    move: number;
    score: number;
}

export class BoardEvaluator {
    public static getBestMove(board: GameBoard, depth: number, callback: (progress: number) => void) {
        let move: number;
        if (depth == 0) { // Select a move randomly
            let moves = board.getAvailableMoves();
            move = moves[Math.floor(Math.random() * moves.length)];
        } else { // Calculate best move
            let forPlayer = board.getTurn();
            if (depth < 0) { // Try to lose if depth < 0
                depth = -depth;
                let p1 = Player.Player1, p2 = Player.Player2;
                forPlayer = forPlayer == p1 ? p2 : p1;
            }

            move = this.minimax(board, forPlayer, depth, -Infinity, Infinity, callback).move;
        }

        // Randomly select from best moves
        callback && callback(1);
        return move;
    }
    
    private static minimax(board: GameBoard, forPlayer: Player, depth: number,
            alpha: number, beta: number, callback: (progress: number) => void): Move {
        
        // Check to see if it's the end of the search
        if (depth == 0 || board.isGameOver()) {
            return {move: null, score: board.getBoardValue(forPlayer)};
        }

        // Continue to calculate move value
        let bestMove: Move = {move: null, score: null};
        let turn = board.getTurn();
        let moves = board.getAvailableMoves();
        if (turn == forPlayer) { // Maximize
            bestMove.score = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                callback && callback(i / moves.length);

                let moveScore = this.minimax(board.move(moves[i]), forPlayer, depth - 1, alpha, beta, null);
                if (bestMove.score < moveScore.score) {
                    bestMove.score = moveScore.score;
                    bestMove.move = moves[i];
                    alpha = bestMove.score;
                }
                if (alpha >= beta) break;
            };
        } else { // Minimize
            bestMove.score = Infinity;
            for (let i = 0; i < moves.length; i++) {
                callback && callback(i / moves.length);

                let moveScore = this.minimax(board.move(moves[i]), forPlayer, depth - 1, alpha, beta, null);
                if (bestMove.score > moveScore.score) {
                    bestMove.score = moveScore.score;
                    bestMove.move = moves[i];
                    beta = bestMove.score;
                }
                if (alpha >= beta) break;
            };
        }

        return bestMove;
    }
}
