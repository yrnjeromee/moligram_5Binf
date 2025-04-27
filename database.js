const fs = require("fs");
const mysql = require("mysql2")
const conf = JSON.parse(fs.readFileSync("./public/conf.json")).dbLogin;


conf.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem')
}

//console.log(conf)
const connection = mysql.createConnection(conf)
//console.log(connection);

const executeQuery = (query,parametri) => {
    return new Promise((resolve, reject) => {      
          connection.query(query,parametri, (err, result) => {
             if (err) {
                console.error(err);
                reject();     
             }   
             console.log('done');
             resolve(result);         
       });
    })
}

const database = {

    createTable: () => {
        return executeQuery(`
        CREATE TABLE IF NOT EXISTS slider
            ( 
            id INT PRIMARY KEY AUTO_INCREMENT,
            url VARCHAR(255) NOT NULL
            )`);      
    },

    insert: (image) => {
        const sql = `INSERT INTO slider (url) VALUES (?)`;

        const values = [
            image.url
        ];

        return executeQuery(sql, values);
    },

    select: () => {
        const sql = `SELECT id, url FROM slider `;
        return executeQuery(sql); 
    },

    delete: (id) => {
        const sql = `DELETE FROM slider WHERE id = ?`;

        return new Promise((resolve, reject) => {
            connection.query(sql, [id], (err, result) => {
                if (err) {
                    console.error("Errore:", err);
                    reject(err);
                }
                resolve(console.log("OK"));
            });
    });
    }
}

module.exports = database;