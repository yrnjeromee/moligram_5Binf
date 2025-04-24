

const isLogged = sessionStorage.getItem("Logged") === "true";

if (isLogged) {
  openModalButton.classList.remove("hidden");
  modifyButton.classList.remove("hidden");
  deleteButton.classList.remove("hidden");
}

const register = function (username, password) {
  return fetch("conf.json")
    .then((response) => response.json())
    .then((confData) => {
      return fetch("https://ws.cipiaceinfo.it/credential/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          key: confData.cacheToken,
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => {
          console.log("Stato HTTP:", response.status);
          return response.json();
        })
        .then((result) => {
          console.log("Corpo della risposta:", result);
          if (result.result === "Ok") {
            alert("Registrazione completata con successo!");
            openModalButton.classList.remove("hidden");
            modifyButton.classList.remove("hidden");
            deleteButton.classList.remove("hidden");
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
          key: confData.cacheToken,
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.result === true) {
            alert("Login effettuato con successo!");
            openModalButton.classList.remove("hidden");
            modifyButton.classList.remove("hidden");
            deleteButton.classList.remove("hidden");
            sessionStorage.setItem("Logged", "true");
          } else {
            alert("Credenziali errate.");
          }
        })
        .catch((error) => {
          console.error("Errore login:", error);
          alert("Login fallito. Controlla le credenziali.");
        });
    });
};

loginButton.onclick = () => {
  const username = loginUsername.value;
  const password = loginPassword.value;
  if (username && password) {
    login(username, password);
  } else {
    alert("Compila tutti i campi.");
  }
};