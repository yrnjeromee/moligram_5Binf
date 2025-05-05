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

//Componente Registrazione - Login

export const createRegistrazione = () => {
    let isRegistered = false;
    return {
        checkRegister: (username, password) => {
            const verifica_email = "@itis-molinari.eu";
            let dominio = "@" + username.split("@")[1];

            if (verifica_email !== dominio) {
                return Promise.reject("Dominio email non valido");
            }

            return fetch("conf.json")
                .then((response) => response.json())
                .then((confData) => {
                    return fetch("https://ws.cipiaceinfo.it/credential/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            key: confData.loginToken,
                        },
                        body: JSON.stringify({ username, password }),
                    });
                })
                .then((response) => {
                    console.log("Response status:", response.status);
                    return response.json();
                })
                .then((result) => {
                    console.log("Result:", result);
                    return result.result;
                })
                .catch((error) => {
                    console.error("Errore registrazione:", error);
                    alert("Errore durante la registrazione");
                    throw error;
                });
        },

        validateRegister: () => {
            isRegistered = true;
        },
    };
};

export const createLogin = () => {
    let isLogged = false;
    return {
        checkLogin: (username, password) => {
            return new Promise ((resolve,reject) => {
                fetch("conf.json").then((response) => response.json()).then((confData) => {
                    fetch("https://ws.cipiaceinfo.it/credential/login", {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        key: confData.loginToken,
                        },
                        body: JSON.stringify({ username, password }),
                    })
                    .then((response) => response.json())
                    .then((result) => {
                        resolve(result.result);
                    })
                    .catch((error) => {
                        console.error("Errore login:", error);
                        alert("Errore");
                        reject (result);
                    });
                })
            });
        },
        validateLogin: () => {
            isLogged = true;
        },
    }
  return
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
export const MostraImmagini = (newElement) => {
    let images = [];
    const bindingElement = newElement;
    let displayedImage = 0;
    return {
        render: () => {
            console.log("render");
            let line = "";
            images.forEach((immagine) => {
                line += `<div>`
                line += `<img src="./../files/${immagine.url}" alt="IMMAGINE" style = "width: 100%">`;
                line += `</div>`
            })
            bindingElement.innerHTML = `<img src="../${images[displayedImage].url}" alt="IMMAGINE" style = "width: 100%">`;
        },
        setImages: (newImages) => {
            images = newImages;
        }
    }
};