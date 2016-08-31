import {State} from "./state";
import {Game, GameBoard, Player} from "./game";
import * as TicTacToe from "./games/tic-tac-toe";

export class GameManager {
    private menu: State = new MenuState(this);
    private state: State = this.menu;

    constructor(public container: HTMLElement) {}

    /**
     * Get the containing HTML element.
     */
    public getContainer() {
        return this.container;
    }

    /**
     * Load the game menu.
     */
    public loadMenu() {
        this.setState(this.menu);
    }

    /**
     * Set the state of the GameManager.
     */
    public setState(state: State) {
        this.state = state;
        this.render();
    }

    /**
     * Get the current state of the GameManager.
     */
    public getState() {
        return this.state;
    }

    /**
     * Render the state into the container.
     */
    public render() {
        this.container.innerHTML = null;
        this.state.create(this.container);
    }
}

class MenuState extends State {
    private games = [
        new TicTacToe.GameTicTacToe(this.getGameManager())
    ];

    public getActions() {
        let result: number[] = [];
        this.games.forEach(g => result.push(result.length));
        return result;
    }

    public act(action: number) {
        let game = this.games[action];
        this.getGameManager().setState(game);
    }

    public create(container: HTMLElement) {
        // Create table
        let table = document.createElement("table");
        table.style.width = "100%";
        container.appendChild(table);

        // Insert header
        let headRow = document.createElement("tr");
        let header = document.createElement("th")
        header.innerText = "Select a game";
        table.appendChild(headRow).appendChild(header);

        // Populate table with buttons
        let actions = this.getActions();
        for (let i of actions) {
            // Add row and cell to table
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            tr.style.height = "30pt";
            table.appendChild(tr).appendChild(td);

            // Add button to table cell
            let game = this.games[actions[i]];
            let text = `${game.getName()} - ${game.getDesc()}`;
            let button = this.createActionButton(actions[i], text);
            td.appendChild(button);
        }
    }
}
