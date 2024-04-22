const express = require('express');
const fs = require('fs');
const translate = require("node-google-translate-skidz");

const app = express();
const PORT = 3000;

const DESCUENTOS_FILE = './descuentos.json';

app.get('/descuentos', (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    fs.readFile(DESCUENTOS_FILE, "utf-8", (error, respuesta) => {
      res.json(respuesta);
    })
  } catch (error) {
    console.error('Error al obtener los datos de descuentos:', error);
  }
});

app.get("/traduccion", (req, res) => {
  try{
        translate({
          text: "price",
          source: "en",
          target: "es"
        }, function (result) {
          res.send(result.translation); // Enviar la traducción al cliente
        })
  }catch(error){
    console.error("Error al traducir");
  }
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});