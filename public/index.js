import { createNavigator, createLogin, createRegistrazione, createMiddleware, MostraImmagini } from "./components.js";

const navigator = createNavigator();
const login = createLogin();
const registrazione = createRegistrazione();
const middleware = createMiddleware();
const immagini = MostraImmagini(document.getElementById("divCarosello"));

document.getElementById("Register-Button").onclick = () => {
    const email = document.getElementById("Register-Mail").value;
    if (email) {
        registrazione.checkRegister(email)
            .then((result) => {
                if (result.success === "Ok") {
                    registrazione.validateRegister();
                } else {
                    alert("Registrazione fallita.");
                }
            })
            .catch(() => alert("Errore durante la registrazione."));
    } else {
        alert("Inserisci l'email.");
    }
};

document.getElementById("Login-Button").onclick = () => {
    const email = document.getElementById("Login-Mail").value;
    const password = document.getElementById("Login-Password").value;
    if (email && password) {
        login.checkLogin(email, password).then((result) => {
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
    console.log("FILE SELEZIONATO:", inputFile.files[0]);

    const formData = new FormData();
    formData.append("file", inputFile.files[0]);
    const body = formData;
    const fetchOptions = {
        method: 'post',
        body: body
    };
    try {
        /*const res = await fetch("https://moligram.dcbps.com/slider/add", fetchOptions);
        const image = res.json();
        console.log(image);*/

        const res = await fetch("https://moligram.dcbps.com/slider/add", fetchOptions);
        const image = await res.json(); //aspetta la risposta convertita in JSON
        console.log("IMAGE:   ",image);


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

document.getElementById("buttonConfermaFile").onclick = handleSubmit;////////////////////!!!

middleware.load().then((data) => {
    if (Array.isArray(data)) {
        immagini.setImages(data);
        immagini.render();
    } else {
        console.error("Dati ricevuti non validi:", data);
    }
});