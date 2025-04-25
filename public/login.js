const LoginUsername = document.getElementById("Login-Username");
const LoginPassword = document.getElementById("Login-Password");
const LoginButton = document.getElementById("Login-Button");
const RegisterUsername = document.getElementById("Register-Username");
const RegisterPassord = document.getElementById("Register-Password");
const RegisterButton = document.getElementById("Register-Button");

const isLogged = sessionStorage.getItem("Logged") === "true";

if (isLogged) {
  openModalButton.classList.remove("hidden");
  modifyButton.classList.remove("hidden");
  deleteButton.classList.remove("hidden");
}

const register = (username, password) => {
  return new Promise((resolve, reject) => {
    fetch("http://ws.cipiaceinfo.it/credential/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "key": loginToken
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then(r => r.json())
    .then(r => {
        resolve(r.result); 
    })
    .catch(reject);
  })
};

const login = (username, password) => {
  return new Promise((resolve, reject) => {
    fetch("http://ws.cipiaceinfo.it/credential/login", {
      method: "POST",
      headers: {
         "content-type": "application/json",
         "key": loginToken
      },
      body: JSON.stringify({
         username: username,
         password: password
      })
    })
    .then(r => r.json())
    .then(r => {
         resolve(r.result); 
      })
    .catch(reject);
  })
};

LoginButton.onclick = () => {
  const username = LoginUsername.value;
  const password = LoginPassword.value;
  if (username && password) {
    login(username, password);
  } else {
    alert("Compila tutti i campi.");
  }
};