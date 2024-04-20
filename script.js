import { crearImagen, crearTitulo, crearDescripcion, crearCategoria, crearPrecio, crearBotonDeCompra } from "./funcionesProd.js";
let json;
const $card = document.getElementsByClassName("card");
axios("https://fakestoreapi.com/products")
.then(respuestaProductos => {
    json = respuestaProductos.data; //parseamos el json a objeto javascript
    return axios("descuentos.json")
})
.then(respuestaDescuentos => {
  let idsDescuentos = respuestaDescuentos.data.map(e => e.id);
  let counter = 0; //contador para jugar con el arreglo de cartas
  json.forEach(e => {
        // Creamos los elementos del DOM para insertar en la carta
        let $titulo = document.createElement("h3");
        let $img = document.createElement("img");
        let $descripcion = document.createElement("p");
        let $categoria = document.createElement("p");
        let $precio = document.createElement("p");
        let $botonDeCompra = document.createElement("button");
        //Creamos un fragmento para insertar todos los elementos de una en el DOM
        let $fragmento = document.createDocumentFragment();
        $fragmento.appendChild(crearImagen(e, $img));
        $fragmento.appendChild(crearTitulo(e, $titulo));
        $fragmento.appendChild(crearDescripcion(e, $descripcion));
        $fragmento.appendChild(crearCategoria(e, $categoria));
        $fragmento.appendChild(crearPrecio(e, $precio, respuestaDescuentos.data));
        $fragmento.appendChild(crearBotonDeCompra(e, $botonDeCompra));
        //corroboramos q el producto q se esta iterando tiene descuentos y si tiene agregamos franja de descuento
        if(idsDescuentos.includes(e.id)){
          let position = idsDescuentos.indexOf(e.id);
          let $franjaRojaDescuento = document.createElement("div");
          let $pDeOFerta = document.createElement("p");
          $franjaRojaDescuento.className = "franjaRojaDescuento";
          $pDeOFerta.className = "deOferta";
          $pDeOFerta.textContent = `de oferta -${respuestaDescuentos.data[position].descuento}%`;
          $franjaRojaDescuento.appendChild($pDeOFerta);
          $card[counter].appendChild($franjaRojaDescuento);
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
  if (contador === null) {
    contador = 0;
    $contadorCarrito.textContent = contador;
  } else {
    $contadorCarrito.textContent = contador;
  }
  //recorremos las cartas
  let arregloDeProductos = JSON.parse(localStorage.getItem("productosCarrito"));
  if (!Array.isArray(arregloDeProductos)) {
    arregloDeProductos = [];
  }
  for (let i = 0; i < $card.length; i++) {
    let descripcion;
    //nos fijamos de q el producto no tenga descuento, si es así la posicion de la descripcion es una mas
    if($card[i].childNodes.length === 7){
      descripcion = $card[i].childNodes[3]; //tomamos el elemento de la descripcion
    }else{
      descripcion = $card[i].childNodes[2]; //tomamos el elemento de la descripcion
    }
    //Codigo para que cuando se produzca el mouse over muestre la descripcion entera
    // y esconda la categoria y el precio del producto
    descripcion.addEventListener("mouseover", () => {
      //Nos fijamos si el producto tiene descuento, si es así la posicion para esconder la categoria y precio es una mas
      if($card[i].childNodes.length === 7){
        $card[i].childNodes[4].style.display = "none";
        $card[i].childNodes[5].style.display = "none";    
      }else{
        $card[i].childNodes[3].style.display = "none";
        $card[i].childNodes[4].style.display = "none";
      }
      descripcion.textContent = `Description:\n${json[i].description}`;
      descripcion.style.whiteSpace = 'pre-line';
    });
    //Lo mismo que para el mouseover pero cuando se produce el mouseleave se muestran
    // de nuevo la categoria y el precio del producto
    descripcion.addEventListener("mouseleave", () => {
      //Nos fijamos si el producto tiene descuento, si es así la posicion para mostrars la categoria y precio es una mas
      if($card[i].childNodes.length === 7){
        $card[i].childNodes[4].style.display = "block";
        $card[i].childNodes[5].style.display = "block";    
      }else{
        $card[i].childNodes[3].style.display = "block";
        $card[i].childNodes[4].style.display = "block";
      }
      descripcion.textContent = `Description:\n${json[i].description.slice(0, 30)}...`;
      descripcion.style.whiteSpace = 'pre-line';
    })
    // localStorage.setItem("contadorCarrito", 0); //seteamos el contador del carrito
    // localStorage.setItem("productosCarrito", JSON.stringify(""));
    $botones[i].addEventListener("click", (evento) => {
      //cada click setea el localstorage contadorCarrito +1 y queda almacenado.
      let contador2 = parseInt(contador);
      localStorage.setItem("contadorCarrito", (contador2 + 1));
      $contadorCarrito.textContent = contador2 + 1;
      contador++;
      //codigo para agregar el producto a la lista de productos del carrito en localStorage
      let productoElegido = evento.target.parentElement.childNodes;
      console.log(productoElegido);
      let elemento;
      if(productoElegido.length === 7){
        elemento = {
          imagen: productoElegido[1].src,
          titulo: productoElegido[2].textContent,
          precio: productoElegido[5].textContent
        }
      }else{
        elemento = {
          imagen: productoElegido[0].src,
          titulo: productoElegido[1].textContent,
          precio: productoElegido[4].textContent
        }
      }
      arregloDeProductos.push(elemento);
      localStorage.setItem("productosCarrito", JSON.stringify(arregloDeProductos));
    });
  }
})
.catch(error => console.log(error.message));
// const consumir = () => {
  //   const xhr = new XMLHttpRequest(); // Paso 1: Crear el objeto XMLHttpRequest
          //   const $card = document.getElementsByClassName("card");
          
          //   xhr.addEventListener("readystatechange", ev => { //Paso 2: Codigo para consumir la API
          //     if (xhr.readyState === 4) {
            //       if (xhr.status >= 200 && xhr.status < 300) { //nos aseguramos de q no haya errores en el estado
            //         const json = JSON.parse(xhr.responseText); //parseamos el json a objeto javascript
            //         let counter = 0; //contador para jugar con el arreglo de cartas
            //         json.forEach(e => {
              //           // Creamos los elementos del DOM para insertar en la carta
          //           let $titulo = document.createElement("h3");
          //           let $img = document.createElement("img");
          //           let $descripcion = document.createElement("p");
          //           let $categoria = document.createElement("p");
          //           let $precio = document.createElement("p");
          //           let $botonDeCompra = document.createElement("button");
          //           //Creamos un fragmento para insertar todos los elementos de una en el DOM
          //           let $fragmento = document.createDocumentFragment();
          //           $fragmento.appendChild(crearImagen(e, $img));
          //           $fragmento.appendChild(crearTitulo(e, $titulo));
          //           $fragmento.appendChild(crearDescripcion(e, $descripcion));
          //           $fragmento.appendChild(crearCategoria(e, $categoria));
          //           $fragmento.appendChild(crearPrecio(e, $precio));
          //           $fragmento.appendChild(crearBotonDeCompra(e, $botonDeCompra));
          //           //Insertamos el fragmento en la carta
          //           $card[counter].appendChild($fragmento);
          //           counter++;
          //         });
          //         const $botones = document.getElementsByClassName("botonDeCompra");
          //         const $contadorCarrito = document.getElementById("contadorCarrito");
          //         //A partir del localStorage seteamos el contador del carrito, esto esta bueno para cuando
          //         // el cliente sale sin querer de la pagina y se guarden los productos en el carrito cuando 
          //         // se vuelve a cargar la pagina.
          //         let contador = localStorage.getItem("contadorCarrito");
          //         if (contador === null) {
          //           contador = 0;
          //           $contadorCarrito.textContent = contador;
          //         } else {
          //           $contadorCarrito.textContent = contador;
          //         }
          //         //recorremos las cartas
          //         let arregloDeProductos = JSON.parse(localStorage.getItem("productosCarrito"));
          //         if (!Array.isArray(arregloDeProductos)) {
          //           arregloDeProductos = [];
          //         }
          //         for (let i = 0; i < $card.length; i++) {
          //           let descripcion = $card[i].childNodes[2]; //tomamos el elemento de la descripcion
          //           //Codigo para que cuando se produzca el mouse over muestre la descripcion entera
          //           // y esconda la categoria y el precio del producto
          //           descripcion.addEventListener("mouseover", () => {
          //             $card[i].childNodes[3].style.display = "none";
          //             $card[i].childNodes[4].style.display = "none";
          //             descripcion.textContent = `Description:\n${json[i].description}`;
          //             descripcion.style.whiteSpace = 'pre-line';
          //           });
          //           //Lo mismo que para el mouseover pero cuando se produce el mouseleave se muestran
          //           // de nuevo la categoria y el precio del producto
          //           descripcion.addEventListener("mouseleave", () => {
          //             $card[i].childNodes[3].style.display = "block";
          //             $card[i].childNodes[4].style.display = "block";
          //             descripcion.textContent = `Description:\n${json[i].description.slice(0, 30)}...`;
          //             descripcion.style.whiteSpace = 'pre-line';
          //           })
          //           // localStorage.setItem("contadorCarrito", 0); //seteamos el contador del carrito
          //           // localStorage.setItem("productosCarrito", JSON.stringify(""));
          //           $botones[i].addEventListener("click", (evento) => {
          //             //cada click setea el localstorage contadorCarrito +1 y queda almacenado.
          //             let contador2 = parseInt(contador);
          //             localStorage.setItem("contadorCarrito", (contador2 + 1));
          //             $contadorCarrito.textContent = contador2 + 1;
          //             contador++;
          //             //codigo para agregar el producto a la lista de productos del carrito en localStorage
          //             let productoElegido = evento.target.parentElement.childNodes;
          //             let elemento = {
          //               imagen: productoElegido[0].src,
          //               titulo: productoElegido[1].textContent,
          //               precio: productoElegido[4].textContent
          //             }
          //             arregloDeProductos.push(elemento);
          //             localStorage.setItem("productosCarrito", JSON.stringify(arregloDeProductos));
          //           });
          //         }
          //       } else {
          //         let mensaje = xhr.statusText || "ocurrió un error."; // si no hay info del estatus se muestra ocurrio un error.
          //         console.log(`Error ${xhr.status}: ${mensaje}`);
          //       }
          //     }
          //   });
          
          //   xhr.open("GET", 'https://fakestoreapi.com/products'); //Paso 3: Metodo open para tomar los datos
          
          //   xhr.send(); //Paso 4: Enviamos la petición
          // }
          // consumir();