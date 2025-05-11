import { createNavigator, createLogin, createRegistrazione, createMiddleware, MostraImmagini } from "./components.js";

const navigator = createNavigator();
const login = createLogin();
const registrazione = createRegistrazione();
const middleware = createMiddleware();
const immagini = MostraImmagini(document.getElementById("divCarosello"));

document.getElementById("Register-Button").onclick = () => {
    const email = document.getElementById("Register-Mail").value;
    if (email) {
        registrazione.checkRegister(email)//false
            .then((result) => {
                if (result.success === "Ok") {
                    registrazione.validateRegister();
                } else {
                    alert("Registrazione fallita.");//  <----------------  QUI
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


                fetch("https://moligram.dcbps.com/utente", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                })
                .then(r => r.json())
                .then(utente => {
                    console.log("Dati utente ricevuti:", utente);
                    window.utente = utente;         //globale
                })
                .catch(err => console.error("Errore nel recupero utente:", err));



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
    const descrizione = document.getElementById('inputDescrizione').value;
    const luogo = document.getElementById('inputLuogo').value;

    const formData = new FormData();
    formData.append("file", inputFile.files[0]);
    formData.append("descrizione", descrizione);
    formData.append("luogo", luogo);
    formData.append("utente_id", utente.id);

    try {
        const res = await fetch("https://moligram.dcbps.com/slider/add", {
            method: 'POST',
            body: formData
        });

        const image = await res.json();
        console.log("IMAGE: ", image);

        if (image.success) {
            window.location.hash = "#home";
            middleware.load().then((newData) => {
                immagini.setImages(newData);
                immagini.render();
            });
        } else {
            console.error("Errore dal server:", image.error);
        }

    } catch (e) {
        console.error("Errore nella richiesta:", e);
    }
};



document.getElementById("AddPostButton").onclick = () => {
    window.location.hash = "#insert";
}

document.getElementById("buttonCancellaFile").onclick = () => {
    window.location.hash = "#home";
}

document.getElementById("buttonConfermaFile").onclick = handleSubmit;

document.getElementById("BottoneProfilo").onclick = () => {
    window.location.hash = "#profilo";


}

middleware.load().then((data) => {
    if (Array.isArray(data)) {
        immagini.setImages(data);
        immagini.render();
    } else {
        console.error("Dati ricevuti non validi:", data);
    }
});