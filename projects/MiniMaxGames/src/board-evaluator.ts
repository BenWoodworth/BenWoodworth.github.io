import {GameBoard, Player} from "./game";

interface movesAndScore {
    moves: number[];
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
            moves = BoardEvaluator.minimax(board, forPlayer, depth, -Infinity, Infinity, callback).moves;
        }
        
        // Randomly select from the best moves
        let i = Math.floor(Math.random() * moves.length);
        !callback || callback(1);
        return moves[i];
    }

    private static minimax(board: GameBoard, forPlayer: Player, depth: number,
            alpha: number, beta: number, callback: (progress: number) => void): movesAndScore {

        // Get available moves
        let moves = board.getAvailableMoves();

        // If the evaluation reached an end state, return current board score
        if (depth == 0 || board.isGameOver()) {
            return {
                moves: moves,
                score: board.getBoardValue(forPlayer)
            };
        }

        // ...otherwise, continue evaluating
        let turn = board.getTurn();
        let bestMoves: movesAndScore = null;
        for (let i = 0; i < moves.length; i++) {
            !callback || callback(i / moves.length);

            // Calculate move score
            let move = moves[i];
            let newBoard = board.move(move);
            let calcMoves = this.minimax(newBoard, forPlayer, depth - 1, null, null, null); // TODO Alpha/Beta pruning

            // Update best move
            if (calcMoves === null) { // Unable to calculate score
                continue;
            } else if (bestMoves === null) { // First score
                bestMoves = calcMoves;
                bestMoves.moves = [move];
            } else if (bestMoves.score == calcMoves.score) { // Same score
                calcMoves.moves.forEach(m => {
                    if (bestMoves.moves.indexOf(m) != -1) return;
                    bestMoves.moves.push(m);
                })
            } else if (turn == forPlayer) { // Try to maximize score
                if (calcMoves.score > bestMoves.score) {
                    bestMoves = calcMoves;
                    bestMoves.moves = [move];
                }
            } else { // Try to minimize score
                if (calcMoves.score < bestMoves.score) {
                    bestMoves = calcMoves;
                    bestMoves.moves = [move];
                }
            }
        }
        
        // Callback, and return
        return bestMoves;
    }
}