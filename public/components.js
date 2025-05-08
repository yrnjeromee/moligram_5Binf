//Componente Navigatore
export const createNavigator = () => {
    const pages = Array.from(document.querySelectorAll(".page"));
 
    const render = () => {
       const url = new URL(document.location.href);
       const pageName = url.hash.replace("#", "") || "login";
       const selected = pages.filter((page) => page.id === pageName)[0] || pages[0];
 
       hide(pages);
       show(selected);
    }
    window.addEventListener('popstate', render); 
    render();
};

//Funzioni
const hide = (elements) => {
    elements.forEach((element) => {
       element.classList.add("hidden");
       element.classList.remove("visible");
    });
};
 
const show = (element) => {
    element.classList.add("visible");
    element.classList.remove("hidden");
};

//Componente Registrazione
export const createRegistrazione = () => {
    return {
        async checkRegister(email) {
            try {
                const dominio = "@" + email.trim().split("@")[1];
                if (dominio !== "@itis-molinari.eu") {
                    alert("Registrazione consentita solo con email @itis-molinari.eu");
                    return { success: false, message: "Dominio email non valido" };
                }
                const response = await fetch("http://localhost:5600/insert", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });
                return await response.json();
            } catch (err) {
                console.error("Errore registrazione:", err);
                return { success: false };
            }
        },
        validateRegister() {
            alert("Controlla la tua email per la password!");
        }
    };
};

//Componente Login
export const createLogin = () => {
    return {
        async checkLogin(email, password) {
            try {
                const response = await fetch("http://localhost:5600/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                return data.success;
            } catch (err) {
                console.error("Errore login:", err);
                return false;
            }
        },
        validateLogin() {
            sessionStorage.setItem("login", "true");
        }
    };
};

//Componente Middleware
export const createMiddleware = () => {
    return {
        send: (image) => {
            return new Promise((resolve, reject) => {
                fetch("http://localhost:5600/slider/add", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(image)
                })
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json);
                    })
            })
        },
        load: () => {
            return new Promise((resolve, reject) => {
                fetch("http://localhost:5600/slider")
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json);       
                    })
            })
        },
        delete: (id) => {
            return new Promise((resolve, reject) => {
                fetch(`http://localhost:5600/delete/${id}`, {
                    method: 'DELETE'                
                })
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json);
                    })
            })
        }
    }
}

//render
export function MostraImmagini(container) {
    let images = [];

    return {
        setImages(newImages) {
            images = newImages;
        },
        render() {
            container.innerHTML = ""; // Pulisce il contenuto

            images.forEach(img => {
                const card = document.createElement("div");
                card.className = "card m-2";
                card.style.width = "18rem";

                const image = document.createElement("img");
                image.src = `http://localhost:5600/files/${img.image}`;
                image.className = "card-img-top";
                image.alt = img.descrizione || "immagine";

                const body = document.createElement("div");
                body.className = "card-body";

                const descr = document.createElement("p");
                descr.className = "card-text";
                descr.textContent = img.descrizione;

                const luogo = document.createElement("small");
                luogo.className = "text-muted";
                luogo.textContent = img.luogo;

                body.appendChild(descr);
                body.appendChild(luogo);
                card.appendChild(image);
                card.appendChild(body);

                container.appendChild(card);
            });
        }
    };
}

