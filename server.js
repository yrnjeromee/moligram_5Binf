const express = require("express");
const http = require('http');
const path = require('path');
const multer  = require('multer');
const cors = require("cors");

const app = express();

const database = require("./database.js");
database.createTable();

app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "files"));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage}).single('file');

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/files", express.static(path.join(__dirname, "files")));

app.post("/slider/add", (req, res) => {
    upload(req, res, (err) => {
        console.log('File caricato:', req.file.filename);
        database.insert({ url: "./files/" + req.file.filename });
        res.json({ url: "./files/" + req.file.filename });
    });
});

app.get('/slider',async (req, res) => {
    const list = await database.select();
    res.json(list);    
})
app.delete('/delete/:id',async (req, res) => {
    const id = req.params.id;
    await database.delete(id)  
    res.json({result: "ok"});   
})

const server = http.createServer(app);

server.listen(5600, () => {
  console.log("- server running");
});