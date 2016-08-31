import {GameManager} from "./src/gameManager";

let container = document.getElementById("content");
let manager = new GameManager(container);
manager.render();
