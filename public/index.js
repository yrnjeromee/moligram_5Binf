import { createNavigator } from "./components.js";

const navigator = createNavigator();

document.getElementById("adminButton").onclick = () => {
    window.location.hash = "#login";
};