import {GameBoard, Player} from "./game";

interface movesAndScore {
    moves: boolean[]; // [undef, undef, true, true] contains the moves 2 and 3.
    score: number; 
}

export class BoardEvaluator {

    public static getBestMove(board: GameBoard, depth: number, callback: (progress: number) => void) {
        let moves: number[];
        if (depth == 0) { // Select all available moves
            moves = board.getAvailableMoves();
        } else {
            // Try to win if depth > 0, try to lose otherwise
            let forPlayer = board.getTurn();
            if (depth < 0) {
                depth *= -1;
                if (forPlayer == Player.Player1) forPlayer = Player.Player2
                else forPlayer = Player.Player1;
            }

            // Select best moves using minimax
            let result = BoardEvaluator.minimax(board, forPlayer, depth, -Infinity, Infinity, callback);
            
            moves = [];
            result.moves.forEach((v, i) => moves.push(i));
            alert(`Score: ${result.score}, Moves: ${moves}`);
        }
        
        // Randomly select from the best moves
        let i = Math.floor(Math.random() * moves.length);
        callback && callback(1);
        return moves[i];
    }

    private static minimax(board: GameBoard, forPlayer: Player, depth: number,
            alpha: number, beta: number, callback: (progress: number) => void): movesAndScore {

        // Get available moves
        let moves = board.getAvailableMoves();

        // If the evaluation reached an end state, return current board score
        if (depth == 0 || board.isGameOver()) {
            return {
                moves: [],
                score: board.getBoardValue(forPlayer)
            };
        }

        // ...otherwise, continue evaluating
        let turn = board.getTurn();
        let bestMoves: movesAndScore = null;
        for (let i = 0; i < moves.length; i++) {
            callback && callback(i / moves.length);
            let move = moves[i];

            // Calculate move score
            let newBoard = board.move(move);
            let calcMoves = this.minimax(newBoard, forPlayer, depth - 1, null, null, null); // TODO Alpha/Beta pruning

            // Update best move
            if (bestMoves == null) { // First score
                bestMoves = calcMoves;
                bestMoves.moves = [];
                bestMoves.moves[move] = true;
            } else if (bestMoves.score == calcMoves.score) { // Same score
                bestMoves.moves[move] = true;
            } else if (turn == forPlayer) { // Try to maximize score
                if (calcMoves.score > bestMoves.score) {
                    bestMoves = calcMoves;
                    bestMoves.moves = [];
                    bestMoves.moves[move] = true;
                }
            } else { // Try to minimize score
                if (calcMoves.score < bestMoves.score) {
                    bestMoves = calcMoves;
                    bestMoves.moves = [];
                    bestMoves.moves[move] = true;
                }
            }
        }
        
        // Callback, and return
        return bestMoves;
    }
}