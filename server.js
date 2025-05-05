const express = require("express");
const http = require('http');
const path = require('path');
const multer = require('multer');
const cors = require("cors");

const app = express();

const database = require("./database.js");
database.createTables(); // Inizializza la creazione delle tabelle

app.use(cors());
app.use(express.json()); // Aggiungi il middleware per il parsing del corpo delle richieste (JSON)

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "files"));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).single('file');

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/files", express.static(path.join(__dirname, "files")));

// Aggiungi un post (file)
app.post("/slider/add", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Errore nel caricamento del file' });
        }

        console.log('File caricato:', req.file.filename);

        // Inserisci il post nel database
        database.insertPost({ 
            url: "./files/" + req.file.filename, 
            descrizione: req.body.descrizione || '', 
            luogo: req.body.luogo || '' 
        })
        .then(() => {
            res.json({ url: "./files/" + req.file.filename });
        })
        .catch(err => {
            res.status(500).json({ error: 'Errore durante l\'inserimento del post' });
        });
    });
});

// Recupera la lista dei post
app.get('/slider', async (req, res) => {
    try {
        const list = await database.selectPosts();
        res.json(list);    
    } catch (err) {
        res.status(500).json({ error: 'Errore durante il recupero dei post' });
    }
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
        res.json({ result: "utente aggiunto" });
    } catch (err) {
        res.status(500).json({ error: 'Errore durante l\'aggiunta dell\'utente' });
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