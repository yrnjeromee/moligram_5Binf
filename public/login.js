const LoginUsername = document.getElementById("Login-Username");
const LoginPassword = document.getElementById("Login-Password");
const LoginButton = document.getElementById("Login-Button");
const RegisterUsername = document.getElementById("Register-Username");
const RegisterPassword = document.getElementById("Register-Password");
const RegisterButton = document.getElementById("Register-Button");

const isLogged = sessionStorage.getItem("Logged") === "true";

const register = function (username, password) {
  return fetch("conf.json")
    .then((response) => response.json())
    .then((confData) => {
      return fetch("https://ws.cipiaceinfo.it/credential/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          key: confData.loginToken,
        },
        body: JSON.stringify({ username, password }),
      });
    })
    .then((response) => {
      console.log("Stato HTTP registrazione:", response.status);
      return response.json();
    })
    .then((result) => {
      console.log("Risultato registrazione:", result);
      if (result.result === "Ok") {
        alert("Registrazione completata con successo!");
        sessionStorage.setItem("Logged", "true");
      } else {
        console.error("Errore durante la registrazione:", result);
        alert("Registrazione fallita.");
      }
    })
    .catch((error) => {
      console.error("Errore registrazione:", error);
      alert("Registrazione fallita.");
    });
};

const login = function (username, password) {
  return fetch("conf.json")
    .then((response) => response.json())
    .then((confData) => {
      return fetch("https://ws.cipiaceinfo.it/credential/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          key: confData.loginToken,
        },
        body: JSON.stringify({ username, password }),
      });
    })
    .then((response) => {
      console.log("Stato HTTP login:", response.status);
      return response.json();
    })
    .then((result) => {
      console.log("Risultato login:", result);
      // Se il server restituisce "Ok", controlliamo "Ok"
      if (result.result === "Ok" || result.result === true) {
        alert("Login effettuato con successo!");
        sessionStorage.setItem("Logged", "true");
      } else {
        console.error("Credenziali errate:", result);
        alert("Credenziali errate.");
      }
    })
    .catch((error) => {
      console.error("Errore login:", error);
      alert("Login fallito. Controlla le credenziali.");
    });
};

// Pulsante di registrazione
RegisterButton.onclick = () => {
  const username = RegisterUsername.value;
  const password = RegisterPassword.value;
  if (username && password) {
    register(username, password);
  } else {
    alert("Compila tutti i campi.");
  }
};

// Pulsante di login
LoginButton.onclick = () => {
  const username = LoginUsername.value;
  const password = LoginPassword.value;
  if (username && password) {
    login(username, password);
  } else {
    alert("Compila tutti i campi.");
  }
};