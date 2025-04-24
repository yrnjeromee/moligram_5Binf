import { createNavigator } from "./components.js";

const navigator = createNavigator();

document.getElementById("LoginButton").onclick = () => {
    window.location.hash = "#login";
};