import {GameManager} from "GameManager";

let container = document.getElementById("content");
let manager = new GameManager(container);
manager.render();

alert("Hello world!");