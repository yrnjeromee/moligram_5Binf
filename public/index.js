import { createNavigator, createLogin, createRegistrazione } from "./components.js";

const navigator = createNavigator();
const login = createLogin();
const registrazione = createRegistrazione();

document.getElementById("Register-Button").onclick = () => {
    const username = document.getElementById("Register-Username").value;
    const password = document.getElementById("Register-Password").value;
    
    if (username && password) {
        registrazione.checkRegister(username, password)
            .then((result) => {
                console.log("Risultato registrazione:", result);
                if (result === "Ok") {
                    registrazione.validateRegister();
                    alert("Registrazione avvenuta con successo!");
                } else {
                    alert("Registrazione fallita. Riprova.");
                }
            })
            .catch((error) => {
                console.error("Errore nella registrazione:", error);
                alert("Errore durante la registrazione. Riprova più tardi.");
            });
    } else {
        alert("Compila tutti i campi.");
    }
};


document.getElementById("Login-Button").onclick = () => {
    const username = document.getElementById("Login-Username").value;
    const password = document.getElementById("Login-Password").value;
    if (username && password) {
        login.checkLogin(username, password).then((result) => {
            console.log(result);
            if (result === true) {
                login.validateLogin();
                window.location.hash = "#home";
                console.log("Accesso riuscito");
            } else {
                alert("Credenziali errate");
            }
        }, console.log);
    } else {
      alert("Compila tutti i campi.");
    }
};