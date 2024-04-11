  
  // funciones para crear los elementos de cada carta, para que sea más facil la lectura del código
  // y tambien para que sea mas comodo el agregar estilos a cada elemento
  export const crearImagen = (producto, i) => {
    i.src = producto.image;
    i.style.height = "200px";
    i.style.width = "95%";
    i.style.margin = "5px";
    i.style.borderRadius = "10px";
    return i;
  }
  export const crearTitulo = (producto, t) => {
    t.style.fontFamily = "monospace";
    t.style.backgroundColor = "#929982";
    t.innerHTML = `${(producto.title).toUpperCase()}`;
    return t;
  }
  export const crearDescripcion = (producto, d) => {
    d.style.fontFamily = "lato";
    d.innerHTML = `Description: <br>${producto.description.slice(0,30)}...`;
    return d;
  }
  export const crearCategoria = (producto, c) => {
    c.innerHTML = `Category: ${producto.category}`;
    return c;
  }
  export const crearPrecio = (producto, p) => {
    p.innerHTML = `Price: $${producto.price}`;
    return p;
  }
  export const crearBotonDeCompra = (e, b) => {
    b.innerHTML = "Agregar al carrito";
    b.style.margin = "0px 0px 5px 0px";
    b.className = "botonDeCompra";    
    return b;
  }