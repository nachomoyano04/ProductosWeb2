import { crearImagen, crearTitulo, crearDescripcion, crearCategoria, crearPrecio, crearBotonDeCompra, aplicarDescuento} from "./funcionesProd.js";
let json;
const $card = document.getElementsByClassName("card");
axios("https://fakestoreapi.com/products")
.then(respuestaProductos => {
    json = respuestaProductos.data; //asignamos la variable global json a la respuesta de la API fakestore
    Promise.all(json.map(async e => { //mapeamos el json desde la API traduciendo titulo, descripcion y categoría
      e.title = await traducir(e.title);
      e.description = await traducir(e.description);
      e.category = await traducir(e.category); 
      return e;
    }))
    .then(p => {
      json = p //asignamos lo mapeado a json
      return axios("http://localhost:3000/descuentos") //hacemos el request al servidor para descuentos
        .then(respuestaDescuentos => {
          const respuestaDescuentosJSON = JSON.parse(respuestaDescuentos.data);
          let idsDescuentos = respuestaDescuentosJSON.map(e => e.id);
          let counter = 0; //contador para jugar con el arreglo de cartas
          json.forEach(e => {              
              //Creamos un fragmento para insertar todos los elementos de una en el DOM
              let $fragmento = document.createDocumentFragment();
              $fragmento.appendChild(crearImagen(e));
              $fragmento.appendChild(crearTitulo(e));
              $fragmento.appendChild(crearDescripcion(e));
              $fragmento.appendChild(crearCategoria(e));
              $fragmento.appendChild(crearPrecio(e,respuestaDescuentosJSON));
              $fragmento.appendChild(crearBotonDeCompra(e));
              //corroboramos q el producto q se esta iterando tiene descuentos y si tiene agregamos franja de descuento
              if(idsDescuentos.includes(e.id)){
                let position = idsDescuentos.indexOf(e.id);
                let porcentaje = respuestaDescuentosJSON[position].descuento;
                $card[counter].appendChild(aplicarDescuento(position, porcentaje));
              }
              //Insertamos el fragmento en la carta
              $card[counter].appendChild($fragmento);
              counter++;      
          })
          const $botones = document.getElementsByClassName("botonDeCompra");
          const $contadorCarrito = document.getElementById("contadorCarrito");
          //A partir del localStorage seteamos el contador del carrito, esto esta bueno para cuando
          // el cliente sale sin querer de la pagina y se guarden los productos en el carrito cuando 
          // se vuelve a cargar la pagina.
          let contador = localStorage.getItem("contadorCarrito");
          let arregloDeProductos = JSON.parse(localStorage.getItem("productosCarrito"));
          window.addEventListener("pageshow", event => { //actualizamos cuando se vuelve atrás del carrito
            if(event.eventPhase === 2){
              contador = localStorage.getItem("contadorCarrito");    
              arregloDeProductos = JSON.parse(localStorage.getItem("productosCarrito"));
              if(contador === null){
                contador = 0;
              }
              if(!Array.isArray(arregloDeProductos)){
                arregloDeProductos = [];
              }
              $contadorCarrito.textContent = contador;
            }
          });
          if (contador === null) {
            contador = 0;
            $contadorCarrito.textContent = contador;
          } else {
            $contadorCarrito.textContent = contador;
          }
          for (let i = 0; i < $card.length; i++) {
            let descripcion;
            //nos fijamos de q el producto no tenga descuento, si es así la posicion de la descripcion es una mas
            if($card[i].childNodes.length === 7){
              descripcion = $card[i].childNodes[3]; //tomamos el elemento de la descripcion
            }else{
              descripcion = $card[i].childNodes[2]; //tomamos el elemento de la descripcion
            }

            $botones[i].addEventListener("click", (evento) => {
              //codigo para agregar el producto a la lista de productos del carrito en localStorage
              let productoElegido = evento.target.parentElement.childNodes;
              let elemento;
              if(productoElegido.length === 7){
                elemento = {
                  imagen: productoElegido[1].src,
                  titulo: productoElegido[2].textContent,
                  precio: productoElegido[5].childNodes[0].textContent,
                  precioFinal: productoElegido[5].childNodes[1].textContent
                }
              }else{
                elemento = {
                  imagen: productoElegido[0].src,
                  titulo: productoElegido[1].textContent,
                  precio: productoElegido[4].textContent
                }
              }
              if(arregloDeProductos === null){
                arregloDeProductos = [];
              }
              let yaEstaEnCarrito = false;
              arregloDeProductos.forEach(e => {
                if(e.titulo === elemento.titulo){
                  yaEstaEnCarrito = true;
                  return yaEstaEnCarrito;
                }
              })
              if(!yaEstaEnCarrito){ //Nos fijamos q no este ya en el carrito
                //cada click setea el localstorage contadorCarrito +1 y queda almacenado.
                let contador2 = parseInt(contador);
                localStorage.setItem("contadorCarrito", (contador2 + 1));
                $contadorCarrito.textContent = contador2 + 1;
                contador++;
              }
              arregloDeProductos.push(elemento);
              localStorage.setItem("productosCarrito", JSON.stringify(arregloDeProductos));
              mostrarMensajeProductoAgregado();
          });
          const mostrarMensajeProductoAgregado = () => {
              let $mensaje = document.createElement("p");
              $mensaje.className = "mensajeProductoAgregado";
              $mensaje.innerHTML = "Agregado al carrito correctamente";
              let b = document.querySelector("body");
              b.appendChild($mensaje);
              setTimeout(() => { 
                b.removeChild($mensaje);
              }, 1500);
            }
          }
        })
  .catch(e => console.log("Error", e.message))
    })
})   
.catch(e => console.log("Error: ", e.message))

const traducir = (elemento) => {
    return axios(`http://localhost:3000/traduccion/${encodeURIComponent(elemento)}`)
      .then(res => {
        let elemento = res.data;
        return elemento;
      })
      .catch(e => {
        console.log("Error", e.message);
      })
}