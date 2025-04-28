import { createNavigator, createLogin, createRegistrazione, createMiddleware, MostraImmagini } from "./components.js";

const navigator = createNavigator();
const login = createLogin();
const registrazione = createRegistrazione();
const middleware = createMiddleware();
const immagini = MostraImmagini(document.getElementById("divCarosello"));

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
                middleware.load().then((newData) => {
                    console.log(newData);
                });
            } else {
                alert("Credenziali errate");
            }
        }, console.log);
    } else {
      alert("Compila tutti i campi.");
    }
};


//Upload File
const handleSubmit = async (event) => {
    const inputFile = document.getElementById('inputFile');
    const formData = new FormData();
    formData.append("file", inputFile.files[0]);
    const body = formData;
    const fetchOptions = {
        method: 'post',
        body: body
    };
    try {
        const res = await fetch("http://localhost:5600/slider/add", fetchOptions);
        const image = await res.json();
        console.log(image);
        window.location.hash = "#home";
        middleware.load().then((newData) => {
            console.log(newData);
            immagini.setImages(newData);
            immagini.render();
        })  
    } catch (e) {
        console.log(e);
    }

    //middleware.send({url:inputFile.files[0].name}).then(console.log);
}

document.getElementById("AddPostButton").onclick = () => {
    window.location.hash = "#insert";
}

document.getElementById("buttonCancellaFile").onclick = () => {
    window.location.hash = "#home";
}

document.getElementById("buttonConfermaFile").onclick = handleSubmit;