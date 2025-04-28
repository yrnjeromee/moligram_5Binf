import { createNavigator, createLogin, createRegistrazione, createMiddleware } from "./components.js";

const navigator = createNavigator();
const login = createLogin();
const registrazione = createRegistrazione();
const middleware = createMiddleware();

const renderSlider = (images) => {
    const divCarosello = document.getElementById('divCarosello');
    divCarosello.innerHTML = '';
    images.forEach((img) => {
        const imgElement = document.createElement('img');
        imgElement.src = `http://localhost:5600/files/${img.filename}`;
        imgElement.alt = img.description || "Immagine caricata";
        imgElement.style.maxWidth = "100%";
        imgElement.style.maxHeight = "500px";
        imgElement.style.margin = "10px";
        divCarosello.appendChild(imgElement);
    });
};

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
                    renderSlider(newData);
                });
            } else {
                alert("Credenziali errate");
            }
        }, console.log);
    } else {
      alert("Compila tutti i campi.");
    }
};

middleware.load().then((newData) => {
    console.log(newData);
    renderSlider(newData);
});

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
        const res = await fetch("http://localhost:5600/files/add", fetchOptions);
        const image = res.json();
        window.location.hash = "#home";
        middleware.load().then((newData) => {
            console.log(newData);
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