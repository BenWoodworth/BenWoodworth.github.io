import {GameManager} from "./src/game-manager";

let container = document.getElementById("content");
let manager = new GameManager(container);
manager.render();
