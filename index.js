const gallery = document.getElementById('gallery');
const inputNombre = document.getElementById("buscadorNombre");
const inputId = document.getElementById("buscadorId");
const botonBuscar = document.getElementById("botonBuscar");




async function cargarDigimons () {

try {
    const num = Math.floor(Math.random() * 124);
    const respuesta = await fetch(`https://digi-api.com/api/v1/digimon?page=${num}&pageSize=12`);
    const digimons = await respuesta.json();

    const resultados = digimons.content;

    console.log(digimons)


    const digimonHTML = resultados.map(digimon => {

        return `
    <a href="details.html?id=${digimon.id}" class="card">
    <img src="${digimon.image}" alt="${digimon.name}" />
    <p class="txtId">${digimon.id}</p>
    <h3 class="txtNombre">${digimon.name}</h3>
    </a>
        `
    }).join('');

    gallery.innerHTML = digimonHTML;

} catch {
    console.error("Error al cargar Digimons");
}

}


cargarDigimons();

botonBuscar.addEventListener('click', async () => {
  const id = inputId.value.trim();
  const nombre = inputNombre.value.trim().toLowerCase();

  if (id === ""  && nombre === "") {
    cargarDigimons();
    return;
  }

  try {
    const res = await fetch(`https://digi-api.com/api/v1/digimon?page=0&pageSize=1500`);
    const data = await res.json();
    const resultados = data.content;


const filtrados = resultados.filter(d => {
  let coincideId = true;
  let coincideNombre = true;

  if (id != "") {
    coincideId = d.id.toString().startsWith(id);
  }

  if (nombre != "") {
    coincideNombre = d.name.toLowerCase().startsWith(nombre);
  }

  return coincideId && coincideNombre;
});

    if (filtrados.length > 0) {
      const busquedaHTML = filtrados.map(d => `
        <a href="details.html?id=${d.id}" class="card">
          <img src="${d.image}" alt="${d.name}" />
          <p class="txtId">${d.id}</p>
          <h3 class="txtNombre">${d.name}</h3>
        </a>
      `).join('');
      gallery.innerHTML = busquedaHTML;
    } else {
      gallery.innerHTML = `<p>No se encontraron Digimon que coincidan con la búsqueda.</p>`;
    }

  } catch (error) {
    console.error(error);
    gallery.innerHTML = `<p>Error en la búsqueda.</p>`;
  }
});





