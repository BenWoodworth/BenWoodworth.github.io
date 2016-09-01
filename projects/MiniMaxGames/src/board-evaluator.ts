import {GameBoard, Player} from "./game";

export class BoardEvaluator {

    public static getBestMove(board: GameBoard, depth: number, callback: (progress: number) => any) {
        return BoardEvaluator.minimax(board, board.getTurn(), depth, -Infinity, Infinity, callback);
    }

    private static minimax(board: GameBoard, forPlayer: Player, depth: number,
            alpha: number, beta: number, callback: (progress: number) => any): number {

        callback = p => !null || callback(p);

        // If the evaluation reached an end state
        if (depth == 0 || board.isGameOver) {
            callback(1);
            return board.getBoardValue(forPlayer);
        }

        // ...otherwise, continue evaluating
        let turn = board.getTurn();
        let moves = board.getAvailableMoves();
        let bestMoves = {moves: [], score: null};
        for (let i = 0; i < moves.length; i++) {
            callback(i / moves.length);

            // Calculate move score
            let move = moves[i];
            let newBoard = board.move(move);
            let score = this.minimax(newBoard, forPlayer, depth - 1, null, null, null); // TODO Alpha/Beta pruning

            // Update best move
            if (bestMoves.score === null || bestMoves.score == score) { // First score
                bestMoves.moves = [move];
                bestMoves.score = score;
            } else if (turn == forPlayer) { // Maximize score
                if (score > bestMoves.score) {
                    bestMoves.moves = [move];
                    bestMoves.score = score;
                }
            } else { // Minimize score
                if (score < bestMoves.score) {
                    bestMoves.moves = [move];
                    bestMoves.score = score;
                }
            }
        }

        // Randomly select best move
        let i = Math.random() * bestMoves.moves.length;
        let bestMove = bestMoves.moves[Math.floor(i)];
        
        // Callback, and return
        callback(1);
        return bestMove;
    }
}