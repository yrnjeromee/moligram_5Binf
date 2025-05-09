const fs = require("fs");
const mysql = require("mysql2");
const conf = JSON.parse(fs.readFileSync("./conf.json")).dbLogin;

conf.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem')
};

const connection = mysql.createConnection(conf);

const executeQuery = (query, parametri) => {
    return new Promise((resolve, reject) => {      
        connection.query(query, parametri, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);     
            } else {
                console.log('done');
                resolve(result);    
            }     
        });
    });
};

const database = {

    createTables: () => {
        const createPosts = `
            CREATE TABLE IF NOT EXISTS posts (
                id INT PRIMARY KEY AUTO_INCREMENT,
                image VARCHAR(255) NOT NULL,
                descrizione TEXT,
                luogo VARCHAR(255),
                utente_id INT,
                FOREIGN KEY (utente_id) REFERENCES utenti(id) ON DELETE SET NULL
            );
        `;


        const createUtenti = `
            CREATE TABLE IF NOT EXISTS utenti (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                follower INT DEFAULT 0,
                seguiti INT DEFAULT 0
            );
        `;

        return executeQuery(createPosts)
            .then(() => executeQuery(createUtenti));
    },

    insertPost: (post) => {
        const sql = `INSERT INTO posts (descrizione, luogo, image, utente_id) VALUES (?, ?, ?, ?)`;
        const values = [post.descrizione, post.luogo, post.image, post.utente_id];
        return executeQuery(sql, values);
    },    
    

    insertUtente: (utente) => {
        const sql = `INSERT INTO utenti (email, password, follower, seguiti) VALUES (?, ?, ?, ?)`;
        const values = [utente.email, utente.password, utente.follower || 0, utente.seguiti || 0];
        return executeQuery(sql, values);
    },

    selectPosts: () => {
        const sql = `SELECT id, descrizione, luogo, image FROM posts`;
        return executeQuery(sql).then(results => {
            return results.map(post => ({
                ...post,
                url: `/files/${post.image}`  // URL accessibile via browser
            }));
        });
    },

    selectUtenti: () => {
        const sql = `SELECT id, email, password, follower, seguiti FROM utenti`;
        return executeQuery(sql);
    },

    deletePost: (id) => {
        const sql = `DELETE FROM posts WHERE id = ?`;
        return executeQuery(sql, [id]);
    },

    deleteUtente: (id) => {
        const sql = `DELETE FROM utenti WHERE id = ?`;
        return executeQuery(sql, [id]);
    },
    
    getAllImages: () => {
        const sql = `SELECT image FROM posts`;
        return executeQuery(sql);
    }
    
};

module.exports = database;