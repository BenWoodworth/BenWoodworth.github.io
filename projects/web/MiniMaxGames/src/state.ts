import {GameManager} from "./gameManager";

export abstract class State {

    constructor(private gameManager: GameManager) { }

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
    public createActionButton(action: number, text: string) {
        var button = document.createElement("button");
        button.disabled = this.getActions().indexOf(action) < 0;
        button.style.width = "100%";
        button.style.height = "100%";
        button.textContent = text;
        button.onclick = () => this.act(action);
        return button;
    }
}
