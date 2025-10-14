const gallery = document.getElementById('gallery');
const inputNombre = document.getElementById("buscadorNombre");
const inputId = document.getElementById("buscadorId");
const botonBuscar = document.getElementById("botonBuscar");




async function cargarDigimons () {

try {
    const num = Math.floor(Math.random() * 124);
    const respuesta = await fetch(`https://digi-api.com/api/v1/digimon?page=${num}&pageSize=12`);
    const digimons = await respuesta.json();

    console.log(digimons)

    const resultados = digimons.content;

    console.log(resultados);

    const digimonHTML = resultados.map(digimon => {

        return `
        <div class = "card" data-id="${digimon.id}">
        <img src = "${digimon.image}" alt ="${digimon.name}"/>
        <p class = "txtId">${digimon.id}</p>
        <h3 class = "txtNombre">${digimon.name}</h3>
        </div>
        `
    }).join('');

    gallery.innerHTML = digimonHTML;

      const cartas = document.querySelectorAll('.card')

      cartas.forEach(card => {
      card.addEventListener('click', () => {
      const digimonId = card.dataset.id;
      window.location.href = `details.html?id=${digimonId}`;
  });
});


} catch {
    console.error("Error al cargar Digimons");
}

}


cargarDigimons();

botonBuscar.addEventListener('click', async () => {
  const id = inputId.value.trim();
  const nombre = inputNombre.value.trim().toLowerCase();

  if (id === "" && nombre === "") {
        console.log("Sin criterio de búsqueda introducido")
    cargarDigimons();
    return;
  }

  try {
    const urls = [];
    for (let i = 0; i <= 10; i++) {
      urls.push(`https://digi-api.com/api/v1/digimon?page=${i}&pageSize=50`);
    }

    const promesas = urls.map(u => fetch(u).then(r => r.json()));
    const respuestas = await Promise.all(promesas);


    let resultados = [];
    for (let i = 0; i < respuestas.length; i++) {
      resultados = resultados.concat(respuestas[i].content);
    }

    let filtrados = [];
    for (let i = 0; i < resultados.length; i++) {
      const d = resultados[i];
      let coincideId = true;
      let coincideNombre = true;

      if (id !== "") {
        coincideId = d.id.toString().startsWith(id);
      }
      if (nombre !== "") {
        coincideNombre = d.name.toLowerCase().includes(nombre);
      }

      if (coincideId && coincideNombre) {
        filtrados.push(d);
      }
    }

    if (filtrados.length > 0) {

      const digimonHTML = filtrados.map(d => `
        <div class="card" data-id="${d.id}">
          <img src="${d.image}" alt="${d.name}"/>
          <p class="txtId">${d.id}</p>
          <h3 class="txtNombre">${d.name}</h3>
        </div>
      `).join('');

      gallery.innerHTML = digimonHTML;

      const cartas = document.querySelectorAll('.card')

      cartas.forEach(card => {
      card.addEventListener('click', () => {
  });
});


    } else {
      gallery.innerHTML = `<p>No se encontraron Digimon que coincidan con la búsqueda.</p>`;
    }

  } catch (error) {
    console.error("Error en la búsqueda");
  }
});





