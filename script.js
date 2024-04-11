import { crearImagen, crearTitulo, crearDescripcion, crearCategoria, crearPrecio, crearBotonDeCompra} from "./funcionesProd.js";
const consumir = () => {
    const xhr = new XMLHttpRequest(); // Paso 1: Crear el objeto XMLHttpRequest
    const $card = document.getElementsByClassName("card");

    xhr.addEventListener("readystatechange", ev => { //Paso 2: Codigo para consumir la API
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300){ //nos aseguramos de q no haya errores en el estado
              const json = JSON.parse(xhr.responseText); //parseamos el json a objeto javascript
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
                $fragmento.appendChild(crearPrecio(e, $precio));
                $fragmento.appendChild(crearBotonDeCompra(e, $botonDeCompra));
                //Insertamos el fragmento en la carta
                $card[counter].appendChild($fragmento);
                counter++;
              });
              const $botones = document.getElementsByClassName("botonDeCompra");
              const $contadorCarrito = document.getElementById("contadorCarrito");
              //A partir del localStorage seteamos el contador del carrito, esto esta bueno para cuando
              // el cliente sale sin querer de la pagina y se guarden los productos en el carrito cuando 
              // se vuelve a cargar la pagina.
              $contadorCarrito.textContent = localStorage.getItem("contadorCarrito");
              //recorremos las cartas
              for(let i = 0; i < $card.length; i++){
                let descripcion = $card[i].childNodes[2]; //tomamos el elemento de la descripcion
                //Codigo para que cuando se produzca el mouse over muestre la descripcion entera
                // y esconda la categoria y el precio del producto
                descripcion.addEventListener("mouseover", () => {
                  $card[i].childNodes[3].style.display = "none";
                  $card[i].childNodes[4].style.display = "none";
                  descripcion.textContent = `Description:\n${json[i].description}`;
                  descripcion.style.whiteSpace = 'pre-line';
                });
                //Lo mismo que para el mouseover pero cuando se produce el mouseleave se muestran
                // de nuevo la categoria y el precio del producto
                descripcion.addEventListener("mouseleave", () => {
                  $card[i].childNodes[3].style.display = "block";
                  $card[i].childNodes[4].style.display = "block";
                  descripcion.textContent = `Description:\n${json[i].description.slice(0,30)}...`;
                  descripcion.style.whiteSpace = 'pre-line';
                })
                // localStorage.setItem("contadorCarrito", 0); //seteamos el contador del carrito
                $botones[i].addEventListener("click", () => {
                    //cada click setea el localstorage contadorCarrito +1 y queda almacenado.
                    let contador = parseInt(localStorage.getItem("contadorCarrito"));
                    localStorage.setItem("contadorCarrito",(contador+1));
                    $contadorCarrito.textContent = contador + 1;
                  });
              }
            }else{
                let mensaje = xhr.statusText || "ocurrió un error."; // si no hay info del estatus se muestra ocurrio un error.
                console.log(`Error ${xhr.status}: ${mensaje}`);
              }
            }
    });

    xhr.open("GET", 'https://fakestoreapi.com/products'); //Paso 3: Metodo open para tomar los datos
    
    xhr.send(); //Paso 4: Enviamos la petición
  }
  consumir();
