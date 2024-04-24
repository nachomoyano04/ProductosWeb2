const express = require('express');
const fs = require('fs');
const translate = require("node-google-translate-skidz");
const path = require("path");

const app = express();
const PORT = 3000;

const DESCUENTOS_FILE = './descuentos.json';

app.use(express.static(path.join(__dirname)));

app.get('/descuentos', (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    fs.readFile(DESCUENTOS_FILE, "utf-8", (error, respuesta) => {
      res.json(respuesta); // res.json() para enviar los descuentos en formato JSON al cliente
    })
  } catch (error) {
    console.error('Error al obtener los datos de descuentos:', error);
  }
});
app.get("/traduccion/:texto", (req, res) => {
  try{
      res.setHeader('Access-Control-Allow-Origin', '*');
      let textoATraducir = req.params.texto;
        translate({
          text: textoATraducir,
          source: "en",
          target: "es"
        }, function (result) {
          res.send(result.translation); // res.send() para enviar lo traducido al cliente
        })
  }catch(error){
    console.error("Error al traducir");
  }
})

app.get("/", (req, res)=> {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});