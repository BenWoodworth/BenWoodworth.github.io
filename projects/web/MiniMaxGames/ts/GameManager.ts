import {Game, GameBoard, Player} from "./Game";
import * as TicTacToe from "./Games/TicTacToe";

export class GameManager {
    private menu: State = new MenuState(this);
    private state: State =this.menu;

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

export abstract class State {
    
    constructor(private gameManager: GameManager) {}

    /**
     * Get this state's GameManager
     */
    public getGameManager() {
        return this.gameManager;
    }

    /**
     * Get a list of available actions.
     */
    public abstract getActions(): number[];

    /**
     * Execute a numbered action.
     */
    public abstract act(action: number): void;

    /**
     * Create this GameState within the provided container.
     */
    public abstract create(container: HTMLElement): void;

    /**
     * Create a button that will execute an action when clicked.
     * The button fills its container's width and height.
     */
    protected createActionButton(action: number, text: string) {
        var button = document.createElement("button");
        button.disabled = this.getActions().indexOf(action) < 0;
        button.style.width = "100%";
        button.style.height = "100%";
        button.textContent = text;
        button.onclick = () => this.act(action);
        return button;
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
    }

    public create(container: HTMLElement) {
        // Create table
        let table = document.createElement("table");
        let tbody = document.createElement("tbody");
        table.appendChild(tbody);

        // Populate table with buttons
        let actions = this.getActions();
        for (let i of actions) {
            // Add row and cell to table
            let row = document.createElement("tr");
            let col = document.createElement("td");
            tbody.appendChild(row).appendChild(col);

            // Add button to table cell
            let game = this.games[actions[i]];
            let text = `{game.getName()} - {game.getDesc()}`;
            let button = this.createActionButton(actions[i], text);
            col.appendChild(button);
        }
    }
}