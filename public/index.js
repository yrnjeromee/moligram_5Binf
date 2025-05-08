import { createNavigator, createLogin, createRegistrazione, createMiddleware, MostraImmagini } from "./components.js";

const navigator = createNavigator();
const login = createLogin();
const registrazione = createRegistrazione();
const middleware = createMiddleware();
const immagini = MostraImmagini(document.getElementById("divCarosello"));
const immaginiProfilo = MostraImmagini(document.getElementById("divProfilo"));

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
        login.checkLogin(email, password)
            .then((result) => {
                if (result.success) {
                    // Salva l'ID utente in sessionStorage
                    sessionStorage.setItem("id_utente", result.id_utente);
                    sessionStorage.setItem("login", "true");
                    
                    // Carica i post iniziali
                    middleware.load().then((newData) => {
                        immagini.setImages(newData);
                        immagini.render();
                    });
                    
                    window.location.hash = "#home";
                } else {
                    alert("Credenziali errate");
                }
            })
            .catch(console.error);
    } else {
        alert("Compila tutti i campi.");
    }
};


//Upload File
const handleSubmit = async (event) => {
    const inputFile = document.getElementById('inputFile');
    const descrizione = document.getElementById('inputDescrizione').value;
    const luogo = document.getElementById('inputLuogo').value;
    const userId = sessionStorage.getItem("id_utente");

    const formData = new FormData();
    formData.append("file", inputFile.files[0]);
    formData.append("descrizione", descrizione);
    formData.append("luogo", luogo);
    formData.append("id_utente", userId);

    try {
        const res = await fetch("https://moligram.dcbps.com/slider/add", {
            method: 'POST',
            body: formData
        });

        const image = await res.json();

        if (image.success) {
            window.location.hash = "#home";
            // Ricarica entrambi gli slider
            middleware.load().then((newData) => {
                immagini.setImages(newData);
                immagini.render();
            });
        }
    } catch (e) {
        console.error("Errore:", e);
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
    const userId = sessionStorage.getItem("id_utente");
    window.location.hash = "#profilo";

    // Carica solo i post dell'utente
    fetch(`https://moligram.dcbps.com/posts/utente/${userId}`)
        .then(response => response.json())
        .then(data => {
            immaginiProfilo.setImages(data);
            immaginiProfilo.render();
        })
        .catch(console.error);
};

middleware.load().then((data) => {
    if (Array.isArray(data)) {
        immagini.setImages(data);
        immagini.render();
    } else {
        console.error("Dati ricevuti non validi:", data);
    }
});