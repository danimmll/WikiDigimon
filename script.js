const gallery = document.getElementById('gallery');


async function cargarDigimons () {

try {
    const num = Math.floor(Math.random() * 148) + 1;
    const respuesta = await fetch(`https://digi-api.com/api/v1/digimon?page=${num}&pageSize=10`);
    const digimons = await respuesta.json();

    console.log(digimons)

    const resultados = digimons.content;

    console.log(resultados);

    const digimonHTML = resultados.map(digimon => {

        return `
        <div class = "card">
        <img src = "${digimon.image}" alt ="${digimon.name}"/>
        <p class = "txtId">${digimon.id}</p>
        <h3 class = "txtNombre">${digimon.name}</h3>
        </div>
        `
    }).join('');

    gallery.innerHTML = digimonHTML;



} catch {
    console.error("Error al cargar Digimons");
}

}


cargarDigimons();




