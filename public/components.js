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
                const response = await fetch("http://localhost:6300/insert", {
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
                const response = await fetch("http://localhost:6300/login", {
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
                fetch("http://localhost:6300/slider/add", {
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
                fetch("http://localhost:6300/slider")
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json);       
                    })
            })
        },
        delete: (id) => {
            return new Promise((resolve, reject) => {
                fetch(`http://localhost:6300/delete/${id}`, {
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
export function MostraImmagini(e) {
    let immagini = [];
    const container = e;

    return {
        setImages: function (data) {
            immagini = data;
            console.log(immagini);
        },

        render: function () {
            console.log(immagini);
            let line = "";
            line += immagini.map(img => {
                console.log("aaa ", img.image);
                return `
                    <div class="card m-2" style="width: 18rem;">
                        <p class="card-text text-muted">${img.luogo || ""}</p>
                        <img src="./../files/${img.image}" class="card-img-top" alt="${img.descrizione || ""}">
                            <div class="card-body">
                                <p class="card-text">${img.descrizione || ""}</p>
                            </div>
                        </div>
                    `;
                }).join('');
                
                console.log("line ",line);
                container.innerHTML = line;
        }
    };
}