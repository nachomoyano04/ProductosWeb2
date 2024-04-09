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
  
  // funciones para crear los elementos de cada carta, para que sea más facil la lectura del código
  // y tambien para que sea mas comodo el agregar estilos a cada elemento
  const crearImagen = (producto, i) => {
    i.src = producto.image;
    i.style.height = "200px";
    i.style.width = "95%";
    i.style.margin = "5px";
    i.style.borderRadius = "10px";
    return i;
  }
  const crearTitulo = (producto, t) => {
    t.style.fontFamily = "monospace";
    t.style.backgroundColor = "#929982";
    t.innerHTML = `${(producto.title).toUpperCase()}`;
    return t;
  }
  const crearDescripcion = (producto, d) => {
    d.style.fontFamily = "lato";
    d.innerHTML = `Description: <br>${producto.description.slice(0,30)}...`;
    return d;
  }
  const crearCategoria = (producto, c) => {
    c.innerHTML = `Category: ${producto.category}`;
    return c;
  }
  const crearPrecio = (producto, p) => {
    p.innerHTML = `Price: $${producto.price}`;
    return p;
  }
  const crearBotonDeCompra = (e, b) => {
    b.innerHTML = "Agregar al carrito";
    b.style.margin = "0px 0px 5px 0px";
    b.id = "botonDeCompra";    
    return b;
  }