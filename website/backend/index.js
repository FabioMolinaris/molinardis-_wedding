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
const token = '';
const chatId = -728193220;
const bot = new TelegramBot(token, { polling: true });

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

app.post('/nuovaVisita/', (req, res) => {
   const query = 'INSERT INTO molinardis.visita(timestamp) VALUES (NOW())';

   db.getConnection(function (err, connection) {
      if (err)
         res.status(500).send("Impossibile connettersi al Database: richiesta scaduta");
      else
         connection.query(query, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
         });
   });
   res.status(200).send("Grazie di esserci!");
})

app.listen(port, () => {
   console.log(`App is listening at http://localhost:${port}`);
});

db.getConnection(function (err, connection) {
   if (err)
      console.log(err);
   else
      console.log(connection);
});