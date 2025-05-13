import { createNavigator, createLogin, createRegistrazione, createMiddleware, MostraImmagini, deletePost } from "./components.js";

const navigator = createNavigator();
const eliminaPost = deletePost;
const login = createLogin();
const registrazione = createRegistrazione();
const middleware = createMiddleware();
const immagini = MostraImmagini(document.getElementById("divCarosello"));
const immagini_profilo = MostraImmagini(document.getElementById("divCarosello-profilo"));

let utente = null;

document.getElementById("Register-Button").onclick = () => {
    const email = document.getElementById("Register-Mail").value;
    console.log("EMAIL  ", email);
    if (email) {
        registrazione.checkRegister(email)//false
            .then((result) => {
                if (result.success === "Ok") {
                    registrazione.validateRegister();
                } else {
                    alert("Registrazione fallita.");// <-
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

                middleware.load().then((newData) => { //            QUI
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
                .then(data => {
                    console.log("Dati utente ricevuti:", data);
                    utente = Array.isArray(data) ? data[0] : data;  //!!!!!!!!!!!!!!!!!!!
                    window.utente = data;     //globale
                    console.log("window utente:", window.utente);

                    // middleware.load().then((newData) => {
                    // console.log(newData);
                    // });

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
    console.log("UTENTEEE:   ", utente);

    const inputFile = document.getElementById('inputFile');
    const descrizione = document.getElementById('inputDescrizione').value;
    const luogo = document.getElementById('inputLuogo').value;

    // console.log("inputFile:   ", inputFile.files[0]);

    if (!utente || !utente.id) {
        alert("Utente non disponibile");
        return;
    }

    if (!inputFile.files[0]) {
        alert("Seleziona un file da caricare.");
        return;
    }

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

        const raw = await res.text();
        console.log("RISPOSTA RAW:", raw);

        let image;
        try {
            image = JSON.parse(raw);
        } catch (parseError) {
            console.error("La risposta non è un JSON valido:", parseError);
            return;
        }

        if (image.success) {
            console.log("UTENTE PER IMMAGINE RENDER: ", utente);
            window.location.hash = "#home";
            const newData = await middleware.load();
            immagini.setImages(newData);
            immagini.render();
        } else {
            console.error("Errore dal server:", image.error || image);
        }

    } catch (e) {
        console.error("Errore nella richiesta:", e);
    }
};





document.getElementById("AddPostButtonHome").onclick = () => {
    window.location.hash = "#insert";
};

document.getElementById("AddPostButtonProfilo").onclick = () => {
    window.location.hash = "#insert";
};

document.getElementById("buttonCancellaFile").onclick = () => {
    window.location.hash = "#home";
}

document.getElementById("buttonConfermaFile").onclick = handleSubmit;

document.getElementById("BottoneProfilo").onclick = () => {
    if (!utente || !utente.id) {
      alert("Devi prima accedere");
      return;
    }
    window.location.hash = "#profilo";
  
    //Caricamento post singolo utente
    fetch(`https://moligram.dcbps.com/slider/user/${utente.id}`)
      .then(r => r.json())
      .then(data => {
        console.log("Post del profilo:", data);
        immagini_profilo.setImages(data);
        immagini_profilo.render_profilo(eliminaPost);
      })
      .catch(err => console.error("Errore fetch profilo:", err));
  };
  

middleware.load().then((data) => {
    if (Array.isArray(data)) {
        immagini.setImages(data);
        immagini.render();
    } else {
        console.error("Dati ricevuti non validi:", data);
    }
});