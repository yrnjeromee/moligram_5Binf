const express = require("express");
const http = require('http');
const path = require('path');
const multer = require('multer');
const cors = require("cors");
const fs = require('fs').promises;
const nodemailer = require("nodemailer");

const app = express();

const database = require("./database.js");
database.createTables(); //creazione delle tabelle

app.use(cors());
app.use(express.json()); //middleware per il parsing delle richieste


const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "files"));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage });


// Legge la configurazione email da conf.json
async function getConfiguration() {
    try {
        const conf = await fs.readFile(path.join(__dirname, 'conf.json'), 'utf-8');
        return JSON.parse(conf);
    } catch (error) {
        console.error("Errore durante il caricamento della configurazione:", error);
    }
}

// Crea il trasportatore SMTP con credenziali dal file conf.json
async function create_trasporter() {
    const conf = await getConfiguration();
    const transporter = nodemailer.createTransport({
        host: "smtp.ionos.it",
        port: 587,
        secure: false,
        auth: {
            user: conf.mail,
            pass: conf.pass
        }
    });
    return transporter;
}

// Invia una email al nuovo utente con la password
const inviaEmail = async (body) => {
    const transporter = await create_trasporter();
    const mailOptions = {
        from: '"moligram.com" <moligram@dcbps.com>',
        to: body.email,
        subject: "La tua nuova password",
        text: `Ciao ${body.username}!\n\nEcco la tua nuova password: ${body.password}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error("Errore invio:", error);
        }
        console.log("Email inviata:", info.response);
    });
};

// const upload = multer({ storage: storage }).single('file');

// Endpoint per registrazione
app.post("/insert", async (req, res) => {
    console.log("entratooooo insert");
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email mancante" });
    }

    const password = Math.random().toString(36).slice(-8);

    try {
        await database.insertUtente({ email, password });
        await inviaEmail({ email, password, username: email.split("@")[0] });
        res.json({ success: "Ok" });
    } catch (err) {
        console.error("Errore durante la registrazione:", err);
        res.status(500).json({ success: false });
    }
});

// Endpoint per login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const utenti = await database.selectUtenti();
        const user = utenti.find(u => u.email === email && u.password === password);
        if (user) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/files", express.static(path.join(__dirname, "files")));


//add post (file)
app.post("/slider/add", upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Nessun file caricato' });
        }

        console.log('File caricato:', req.file.filename);

        await database.insertPost({
            image: req.file.filename,
            descrizione: req.body.descrizione || '',
            luogo: req.body.luogo || '',
            utente_id: req.body.utente_id,
            email_utente: req.body.email_utente
        });

        res.json({ success: true, url: `/files/${req.file.filename}` });

    } catch (err) {
        console.error("Errore durante l'inserimento:", err);
        res.status(500).json({ success: false, error: 'Errore durante l\'inserimento del post' });
    }
});




app.get("/getPostUtente", (req,res) => {
    database.getPostUtente(req.body.id).then((data) => res.json(data))
        .catch((err) => {
            console.error("Errore durante il recupero dei post:", err);
            res.status(500).json({ error: "Errore durante il recupero dei post" });
        });
})





// Recupera la lista dei post
app.get("/slider", (req, res) => {
    database.selectPosts()
        .then((data) => res.json(data))
        .catch((err) => {
            console.error("Errore durante il recupero dei post:", err);
            res.status(500).json({ error: "Errore durante il recupero dei post" });
        });
});


// Elimina un post
app.delete('/delete/post/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await database.deletePost(id);
        res.json({ result: "ok" });
    } catch (err) {
        res.status(500).json({ error: 'Errore durante l\'eliminazione del post' });
    }
});

// Recupera la lista degli utenti
app.get('/utenti', async (req, res) => {
    try {
        const utenti = await database.selectUtenti();
        res.json(utenti);    
    } catch (err) {
        res.status(500).json({ error: 'Errore durante il recupero degli utenti' });
    }
});

app.post('/utente', async (req, res) => {
    try {
        const utente = await database.selectUtente(req.body.email);
        res.json(utente);   
    } catch (err) {
        res.status(500).json({ error: 'Errore durante il recupero dell\'utente' });
    }
});

// Aggiungi un utente
app.post('/utenti/add', async (req, res) => {
    const { email, password, follower = 0, seguiti = 0 } = req.body;

    try {
        await database.insertUtente({ email, password, follower, seguiti });

        // Invia l'email all'utente
        await inviaEmail({
            email: email,
            username: email, // o un vero username se lo hai
            password: password
        });

        res.json({ result: "utente aggiunto e email inviata" });

    } catch (err) {
        console.error("Errore:", err);
        res.status(500).json({ error: 'Errore durante l\'aggiunta dell\'utente o invio email' });
    }
});


// Elimina un utente
app.delete('/delete/utente/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await database.deleteUtente(id);
        res.json({ result: "utente eliminato" });
    } catch (err) {
        res.status(500).json({ error: 'Errore durante l\'eliminazione dell\'utente' });
    }
});

//Post di un utente (sezione profilo)
app.get("/slider/user/:id", async (req, res) => {
    const utenteId = req.params.id;
    try {
      const posts = await database.selectPostsByUser(utenteId);
      res.json(posts);
    } catch (err) {
      console.error("Errore recupero post utente:", err);
      res.status(500).json({ error: "Errore recupero post utente" });
    }
});



const server = http.createServer(app);

server.listen(5600, () => {
    console.log("- server running");
});