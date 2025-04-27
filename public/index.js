import { createNavigator} from "./components.js";

const navigator = createNavigator();

document.getElementById("Login-Button").onclick = () => {
    const username = document.getElementById("Login-Username").value;
    const password = document.getElementById("Login-Password").value;

    if (username && password) {
        login(username, password).then(() => {
            window.location.hash = "#home"; // Naviga alla pagina home dopo il login riuscito
        }).catch((error) => {
            console.error("Errore durante il login:", error); // Mostra errori nel caso di fallimento
            alert("Login fallito. Controlla le credenziali.");
        });
    } else {
        alert("Compila tutti i campi.");
    }
};