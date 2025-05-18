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
                console.log("dentro")
                const dominio = "@" + email.trim().split("@")[1];
                if (dominio !== "@itis-molinari.eu") {
                    alert("Registrazione consentita solo con email @itis-molinari.eu");
                    return { success: false, message: "Dominio email non valido" };
                }
                const response = await fetch("https://moligram.dcbps.com/insert", {
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
                const response = await fetch("https://moligram.dcbps.com/login", {
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
                fetch("https://moligram.dcbps.com/slider/add", {
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
            console.log("LOADDDD");
            return new Promise((resolve, reject) => {
                fetch("https://moligram.dcbps.com/slider")
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json);     
                    })
            })
        },
        delete: (id) => {
            return new Promise((resolve, reject) => {
                fetch(`https://moligram.dcbps.com/delete/${id}`, {
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
            immagini = data.reverse();
            
            console.log("SET IMAGES:     ", immagini);
        },

        render: function () {
            let line = "";
            line += immagini.map(img => {
                return `
                    <div class="card m-2" style="width: 18rem;">
                        <div class="d-flex align-items-center justify-content-between">
                            <p class="card-text mb-0">${(img.email_utente || "utente non caricato").split("@")[0]}</p>
                            <button type="button" class="button-link">segui</button>
                        </div>
                        <p class="card-text">📍 ${img.luogo || ""}</p>
                        <img src="./../files/${img.image}" class="card-img-top" alt="${img.descrizione || ""}">
                        <div class="card-body">
                            <p class="card-text">${img.descrizione || ""}</p>
                        </div>
                        <label class="container-like">
                            <input type="checkbox" />
                            <div class="checkmark">
                                <svg viewBox="0 0 256 256">
                                    <rect fill="none" height="256" width="256"></rect>
                                    <path
                                        d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z"
                                        stroke-width="20px"
                                        stroke="#fff"
                                        fill="none">
                                    </path>
                                </svg>
                            </div>
                        </label>
                    </div>
                `;
            }).join('');

            container.innerHTML = line;

            container.querySelectorAll(".button-link").forEach(button => {
                button.onclick = () => {
                    button.textContent = "seguito";
                    button.disabled = true;
                    button.classList.add("text-light");
                };
            });
        },


        render_profilo: function (eliminaPost) {
            console.log("RENDER PROFILO:    ", immagini);
            let line = "";
            line += immagini.map(img => {
                return `
                    <div class="card m-2" data-id="${img.id}" style="width: 18rem;">
                        <p class="card-text">${img.luogo || ""}</p>
                        <img src="./../files/${img.image}" class="card-img-top" alt="${img.descrizione || ""}">
                            <div class="card-body">
                                <p class="card-text">${img.descrizione || ""}</p>
                                <button class="btn-elimina" data-id="${img.id}">Elimina</button>
                            </div>
                    </div>
                    `;
                }).join('');
                container.innerHTML = line;

                document.querySelectorAll('.btn-elimina').forEach(button => {
                    button.addEventListener('click', () => {
                        const postId = button.dataset.id;
                        eliminaPost(postId);
                    });
                });
        },
    };
};

export function deletePost(postId) {
    fetch(`/delete/post/${postId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(result => {
            if (result.result === "ok") {
                const postElement = document.querySelector(`.card[data-id="${postId}`);
                if (postElement) postElement.remove();
            } else {
                alert("Errore durante l'eliminazione.");
            }
        })
        .catch(error => {
            console.error("Errore nella richiesta:", error);
            alert("Errore nella comunicazione col server.");
        });
    }