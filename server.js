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


// const storage = multer.diskStorage({        //configurazione personalizzata per dire dove e con che nome salvare i file
//     destination: function (req, file, callback) {   //dove
//         callback(null, path.join(__dirname, "files"));
//     },
//     filename: function (req, file, callback) {
//         const ext = path.extname(file.originalname);
//         const uniqueName = Date.now() + ext;        //nome diverso per tutti
//         callback(null, uniqueName);
//     }
// });

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadPath = path.join(__dirname, 'files');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });


// Legge la configurazione email da conf.json
async function getConfiguration() {
    try {
        const conf = await fs.readFile(path.join(__dirname, 'public', 'conf.json'), 'utf-8');
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
        from: '"dcbps.com" <moligram@dcbps.com>',
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
        console.log("okokokokkokokokokokokokokok");
    } catch (err) {
        console.error("Errore durante la registrazione:", err);
        res.status(500).json({ success: false });
        console.log("gaygaygaygaygaygaygaygaygay");
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


// Aggiungi un post (file)
app.post("/slider/add", upload.single("file"), async (req, res) => {
    try {
        console.log("==== RICHIESTA /slider/add ====");
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "Nessun file ricevuto" });
        }

        const imageName = file.filename;
        const descrizione = req.body.descrizione || "";
        const luogo = req.body.luogo || "";

        await database.insertPost({
            image: imageName,
            descrizione: descrizione,
            luogo: luogo
        });

        res.status(200).json({ success: true, image: imageName });

    } catch (err) {
        console.error("❌ Errore nel caricamento del file:", err);
        res.status(500).json({ error: "Errore interno durante il caricamento del file" });
    }
});







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



const server = http.createServer(app);

server.listen(5600, () => {
    console.log("- server running");
});