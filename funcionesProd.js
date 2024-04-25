  // funciones para crear los elementos de cada carta, para que sea más facil la lectura del código
  // y tambien para que sea mas comodo el agregar estilos a cada elemento
  export const crearImagen = (producto) => {
    let $img = document.createElement("img");
    $img.src = producto.image;
    $img.style.height = "200px";
    $img.style.width = "95%";
    $img.style.margin = "5px";
    $img.style.borderRadius = "10px";
    return $img;
  }
  export const crearTitulo = (producto) => {
    let $titulo = document.createElement("h3");
    $titulo.innerHTML = `${(producto.title)}`;
    return $titulo;
  }
  export const crearDescripcion = (producto) => {
    let $descripcion = document.createElement("p");
    $descripcion.className = "tooltip";
    let icono = `<i class="fa-solid fa-circle-info"></i>`;
    $descripcion.innerHTML = `Descripción: ${producto.description.slice(0,30)}...${icono}<span class="tooltiptext">${producto.description}</span>`;
    return $descripcion;
  }
  export const crearCategoria = (producto) => {
    let $categoria = document.createElement("p");
    $categoria.innerHTML = `Categoría: ${producto.category}`;
    return $categoria;
  }
  export const crearPrecio = (producto, productoDescuento) => {
    let $precio = document.createElement("p");
    let ids = productoDescuento.map(e => e.id);
    let $divPrecios = document.createElement("div");
    let precio = producto.price;
    if(ids.includes(producto.id)){
      let posicion = ids.indexOf(producto.id);
      let descuento = productoDescuento[posicion].descuento;
      let precioFinal = precio - (precio*descuento/100);
      let $pPrecioDescontado = document.createElement("p");
      let $descuento = document.createElement("p");
      $descuento.innerHTML = `${descuento}% OFF`;
      $descuento.style.color = "#00a650";
      $pPrecioDescontado.innerHTML = `$${precio}`;
      $pPrecioDescontado.className = "tachado";
      let $pPorcentaje = document.createElement("p");
      $pPorcentaje.innerHTML = `Ahorras: $${(precio-precioFinal).toFixed(2)} !!!`;
      $pPorcentaje.style.color = "#00a650";
      $precio.innerHTML = `$${precioFinal.toFixed(2)}`;
      $precio.style.fontSize = "23px";
      $precio.style.marginBottom =  "0px";
      $divPrecios.className = "divPreciosProductosConDescuento"
      $divPrecios.appendChild($pPrecioDescontado);
      $divPrecios.appendChild($precio);
      $divPrecios.appendChild($descuento);
      $divPrecios.appendChild($pPorcentaje);
    }else{
      $precio.innerHTML = `$${producto.price}`;
      $precio.style.fontSize = "23px";
      $divPrecios.appendChild($precio);
    }
    return $divPrecios;
  }
  export const crearBotonDeCompra = (e) => {
    let $botonDeCompra = document.createElement("button");
    $botonDeCompra.innerHTML = "Agregar al carrito";
    $botonDeCompra.style.margin = "0px 0px 5px 0px";
    $botonDeCompra.className = "botonDeCompra";    
    return $botonDeCompra;
  }

  export const aplicarDescuento = (position, porcentaje) => {
    let $franjaRojaDescuento = document.createElement("div");
    let $pDeOFerta = document.createElement("p");
    $franjaRojaDescuento.className = "franjaRojaDescuento";
    $pDeOFerta.className = "deOferta";
    $pDeOFerta.textContent = `DE OFERTA`;
    $franjaRojaDescuento.appendChild($pDeOFerta);
    return $franjaRojaDescuento;
  }