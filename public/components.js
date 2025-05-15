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
export function MostraImmagini(container) {
  let images = [];
  return {
    setImages(data) { images = data; },
    render() {
      container.innerHTML = images.map(img => `
        <div class="card m-2" style="width: 18rem;" data-id="${img.id}">
          <p class="card-text text-muted">${img.email_utente}</p>
          <p class="card-text text-muted">${img.luogo || ''}</p>
          <img src="/files/${img.image}" class="card-img-top" alt="${img.descrizione || ''}">
          <div class="card-body">
            <p class="card-text">${img.descrizione || ''}</p>
          </div>
        </div>
      `).join('');
    },
    renderWithFollow(currentUser, followingList) {
      container.innerHTML = images.map(img => `
        <div class="card m-2" style="width: 18rem;" data-id="${img.id}">
          <p class="card-text text-muted">${img.email_utente}</p>
          <p class="card-text text-muted">${img.luogo || ''}</p>
          <img src="/files/${img.image}" class="card-img-top" alt="${img.descrizione || ''}">
          <div class="card-body">
            <p class="card-text">${img.descrizione || ''}</p>
            ${img.utente_id !== currentUser.id && !followingList.includes(img.utente_id)
              ? `<button class="btn btn-primary follow-btn" data-id="${img.utente_id}">Segui</button>`
              : ''}
          </div>
        </div>
      `).join('');
      container.querySelectorAll('.follow-btn').forEach(btn => {
        btn.addEventListener('click', async e => {
          const followeeId = e.target.dataset.id;
          await fetch(`https://moligram.dcbps.com/follow/${followeeId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followerId: currentUser.id })
          });
          e.target.remove();
        });
      });
    }
  };
}

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