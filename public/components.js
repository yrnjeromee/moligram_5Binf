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