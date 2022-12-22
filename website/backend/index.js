const express = require('express');
const mysql = require('mysql');
const helmet = require('helmet');

const cors = require('cors');

const app = express();
const port = 3001;

let db = mysql.createPool({
   connectionLimit: 30,
   user: 'root',
   password: 'Bcnxmz09@',
   host: '172.21.0.3',
   database: 'molinardis'
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE, HEAD, OPTIONS');
   res.header('Access-Control-Allow-Headers', 'Content-Type');
   next();
});

const TelegramBot = require('node-telegram-bot-api');
const token = '5879187179:AAHuV5NcyEI-Eq0t7mDRzUsFfM0zfTv-hw8';
const chatId = -728193220;
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
   const chatId = msg.chat.id;
   //bot.sendMessage(chatId, '' + chatId + 'Received your message');
});

app.post('/messaggio/', (req, res) => {
   const query = 'INSERT INTO molinardis.messaggi_ricevuti (timestamp, nome, messaggio) VALUES (NOW(), ?, ?)';
   const parameter = [req.body.nome, req.body.testo];

   db.getConnection(function (err, connection) {
      if (err)
         res.status(500).send("Impossibile connettersi al Database: richiesta scaduta");
      else
         connection.query(query, parameter, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
         });
   });
   bot.sendMessage(chatId, "messaggio ricevuto da: " + req.body.nome + "\n\n" + req.body.testo);
   
   res.status(200).send("Messaggio ricevuto");
})
/*
app.get('/situazione/sottoscorta', (req, res) => {
   db.getConnection(function (err, connection) {
      if (err)
         res.status(500).send("Impossibile connettersi al Database: richiesta scaduta");
      else
         connection.query('SELECT * FROM Situazione WHERE  Quantita < QuantitaMinima', function (error, results, fields) {
            connection.release();
            if (err)
               res.status(400).send("Impossibile ottenere gli articoli sottoscorta: richiesta non conforme");
            else
               res.status(200).send(results);
         });
   });
});
*/
/*
app.put('/articoli/:codice', (req, res) => {
   const query = 'UPDATE Articoli SET Codice = ?, Descrizione = ?, Note = ?, idTipologia = ?, idProduttore = ?, Udm = ?, QuantitaMinima = ?, CatalogoWeb = ?, idLocazione = ? WHERE Codice = ?';
   const parameter = [req.body.codice, req.body.descrizione, req.body.note, req.body.tipologia, req.body.produttore, req.body.udm, req.body.quantitaMinima, req.body.catalogoWeb, req.body.locazione, req.params.codice];

   let articoloPrima;
   let articoloDopo;

   db.getConnection(function (err, connection) {
      if (err)
         res.status(500).send("Impossibile connettersi al Database: richiesta scaduta");
      else
         connection.query('SELECT * FROM Articoli where Codice = ?', [req.params.codice], function (error, results, fields) {
            if (results.length == 0) {
               connection.release();
               res.status(404).send("Impossibile modificare articolo: codice non presente nel Magazzino");
            } else {
               articoloPrima = JSON.stringify(results);
               connection.query(query, parameter, function (error, results, fields) {
                  connection.query('SELECT * FROM Articoli where Codice = ?', [req.body.codice], function (error, results, fields) {
                     articoloDopo = JSON.stringify(results);
                     if (articoloPrima === articoloDopo) {
                        connection.release();
                        res.status(400).send("Impossibile modificare articolo: valori dei campi non conformi o uguali a prima");
                     } else {
                        if (req.params.codice != req.body.codice)
                           connection.query('UPDATE Movimenti SET CodiceArticolo = ? WHERE CodiceArticolo = ?', [req.body.codice, req.params.codice], function (error, results, fields) {
                              connection.query('SELECT * FROM Articoli where Codice = ?', [req.body.codice], function (error, results, fields) {
                                 connection.release();
                                 res.status(200).send(results);
                              });
                           });
                        else
                           connection.query('SELECT * FROM Articoli where Codice = ?', [req.body.codice], function (error, results, fields) {
                              connection.release();
                              res.status(200).send(results);
                           });
                     }
                  });
               });
            }
         });
   });
});

app.delete('/articoli/:codice', (req, res) => {
   db.getConnection(function (err, connection) {
      if (err)
         res.status(500).send("Impossibile connettersi al Database: richiesta scaduta");
      else
         connection.query('SELECT * FROM Articoli where Codice = ?', [req.params.codice], function (error, results, fields) {
            if (results.length == 0) {
               connection.release();
               res.status(404).send("Impossibile eliminare articolo: codice non presente nel Magazzino");
            } else
               connection.query('DELETE FROM Articoli where Codice = ?', [req.params.codice], function (error, results, fields) {
                  connection.query('DELETE FROM Movimenti where CodiceArticolo = ?', [req.params.codice], function (error, results, fields) {
                     connection.query('SELECT * FROM Situazione', function (error, results, fields) {
                        connection.release();
                        res.status(200).send(results);
                     });
                  });
               });
         });
   });
});
*/

app.listen(port, () => {
   console.log(`App is listening at http://localhost:${port}`);
});

db.getConnection(function (err, connection) {
   if (err)
      console.log(err);
   else
      console.log(connection);
});
//ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'Bcnxmz09@'