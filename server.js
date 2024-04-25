const express = require('express');
const fs = require('fs');
const translate = require("node-google-translate-skidz");
const path = require("path");

const app = express();
const PORT = 3000;

const DESCUENTOS_FILE = './descuentos.json';

app.use(express.static(path.join(__dirname)));
app.use(express.json());

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

app.post("/compraRealizada", (req, res) => {
  const compraEnJSON = req.body;
  if(!compraEnJSON){
    console.log("El contenido recibido es undefined o nulo");
    return res.status(400).send("El contenido no esta correcto")
  }
  fs.readFile("compras.json", "utf-8", (error, data) => {
    if(error){
      console.log(error)
      return res.status(500).send("Problemas en el servidor");
    }
    let json;
    let cantidad;
    try{
      let contenidoCompras = JSON.parse(data);
      cantidad = contenidoCompras.length;
      json = contenidoCompras;
    }catch(error){
      console.log(error)
      return res.status(500).send("Problemas en el parseo del JSON");
    }
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    let fechaDeHoy = new Date().toLocaleDateString(undefined, options);
    let horaDeHoy = new Date().toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    cantidad++;
    let totalCompra = 0;
    compraEnJSON.forEach(element => {
      totalCompra += parseFloat(element.precioTotal);
    });
    let obj = {
      "Numero de compra": cantidad,
      "Fecha de compra": `${fechaDeHoy} a la hora ${horaDeHoy}`,
      "Productos": compraEnJSON,
      "Total compra": `$${totalCompra.toFixed(2)}`
    }
    json.push(obj);
    fs.writeFile("compras.json", JSON.stringify(json), error => {
      if(error){
        console.log(error)
        return res.status(500).send("Problemas al escribir en el compras.json");
      }
      res.status(200).send("Compra realizada con éxito")
    })
  })
})

app.get("/", (req, res)=> {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});