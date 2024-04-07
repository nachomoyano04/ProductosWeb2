// let consumo = fetch('https://fakestoreapi.com/products').then(res => res.json()).then(res => console.log(res));
const consumir = () => {
    const xhr = new XMLHttpRequest(); // Paso 1: Crear el objeto XMLHttpRequest
    const $card = document.getElementsByClassName("card");

    xhr.addEventListener("readystatechange", ev => { //Paso 2: Codigo para consumir la API
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300){ //nos aseguramos de q no haya errores en el estado
              const json = JSON.parse(xhr.responseText); //parseamos el json a objeto javascript
              let counter = 0; //contador para jugar con el arreglo de cartas
              json.forEach(e => {
                let $li = document.createElement("h5");
                $li.innerHTML = `${e.title}`;
                $card[counter].appendChild($li);
                counter++;
              });
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