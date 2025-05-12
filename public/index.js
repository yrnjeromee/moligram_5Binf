import { createNavigator, createLogin, createRegistrazione, createMiddleware, MostraImmagini } from "./components.js";

const navigator = createNavigator();
const login = createLogin();
const registrazione = createRegistrazione();
const middleware = createMiddleware();
const immagini = MostraImmagini(document.getElementById("divCarosello"));
let utente = null;

// Registrazione
document.getElementById("Register-Button").onclick = () => {
  const email = document.getElementById("Register-Mail").value;
  if (!email) return alert("Inserisci l'email.");

  registrazione.checkRegister(email)
    .then(result => {
      if (result.success === "Ok") registrazione.validateRegister();
      else alert("Registrazione fallita.");
    })
    .catch(() => alert("Errore durante la registrazione."));
};

// Login
document.getElementById("Login-Button").onclick = () => {
  const email = document.getElementById("Login-Mail").value;
  const password = document.getElementById("Login-Password").value;
  if (!email || !password) return alert("Compila tutti i campi.");

  login.checkLogin(email, password)
    .then(valid => {
      if (!valid) return alert("Credenziali errate");

      login.validateLogin();
      window.location.hash = "#home";

      // Recupera i dati utente dal server
      fetch("https://moligram.dcbps.com/utente", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      .then(r => r.json())
      .then(data => {
        utente = Array.isArray(data) ? data[0] : data;
        window.utente = utente;
        loadAllPosts();
      })
      .catch(err => console.error("Errore nel recupero utente:", err));
    })
    .catch(console.error);
};

// Funzione per caricare tutti i post
async function loadAllPosts() {
  try {
    const allPosts = await middleware.load();
    immagini.setImages(allPosts);
    immagini.render();
  } catch (err) {
    console.error("Errore load all posts:", err);
  }
}

// Funzione per caricare solo i post dell'utente
async function loadUserPosts() {
  if (!utente || !utente.id) return;
  try {
    const res = await fetch(`https://moligram.dcbps.com/slider/user/${utente.id}`);
    const data = await res.json();
    immagini.setImages(data);
    immagini.render();
  } catch (err) {
    console.error("Errore load user posts:", err);
  }
}

// Bottone Profilo: mostra solo i tuoi post
document.getElementById("BottoneProfilo").onclick = () => {
  if (!utente || !utente.id) return alert("Devi prima accedere");
  window.location.hash = "#profilo";
  loadUserPosts();
};

// Bottone Aggiungi Post
document.getElementById("AddPostButton").onclick = () => {
  window.location.hash = "#insert";
};

// Upload File
const handleSubmit = async () => {
  if (!utente || !utente.id) return alert("Utente non disponibile");
  const inputFile = document.getElementById('inputFile');
  if (!inputFile.files[0]) return alert("Seleziona un file da caricare.");

  const formData = new FormData();
  formData.append("file", inputFile.files[0]);
  formData.append("descrizione", document.getElementById('inputDescrizione').value);
  formData.append("luogo", document.getElementById('inputLuogo').value);
  formData.append("utente_id", utente.id);

  try {
    const res = await fetch("https://moligram.dcbps.com/slider/add", { method: 'POST', body: formData });
    const image = await res.json();
    if (!image.success) throw new Error(image.error || 'Upload fallito');

    window.location.hash = "#profilo";
    await loadUserPosts();
  } catch (err) {
    console.error("Errore nella richiesta:", err);
  }
};

document.getElementById("buttonConfermaFile").onclick = handleSubmit;
// Cancella form
document.getElementById("buttonCancellaFile").onclick = () => window.location.hash = "#home";

// Avvio iniziale: mostra la home con tutti i post
loadAllPosts();
