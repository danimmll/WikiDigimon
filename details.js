const detalle = document.getElementById('detalle');
const id = window.location.search.split('=')[1];

async function cargarDetalle(id) {
  try {
    const respuesta = await fetch(`https://digi-api.com/api/v1/digimon/${id}`);
    const digimon = await respuesta.json();

    const habilidadesHtml = digimon.skills?.map(s => `
      <p>
        <strong class="stat">${s.skill}:</strong> ${s.description || "No description"}
      </p>
    `).join('');

    const tiposHtml = digimon.types?.map(t => t.type).join(', ');

    const descripcion = digimon.descriptions[1]?.description;

        const fieldsHtml = digimon.fields?.map(f => `
      <div class="fieldCard">
        <img src="${f.image}" alt="${f.field}" title="${f.field}" />
        <p>${f.field}</p>
      </div>
    `).join('');

    let htmlPrev = '';
    for (let e of digimon.priorEvolutions || []) {
      const res = await fetch(`https://digi-api.com/api/v1/digimon/${e.id}`);
      const d = await res.json();
      htmlPrev += `
        <div class="evolucionCard">
          <img src="${d.images?.[0]?.href || ''}" alt="${d.name}" title="${d.name}" />
          <p>${d.name}</p>
        </div>
      `;
    }

    let htmlNext = '';
    for (let e of digimon.nextEvolutions || []) {
      const res = await fetch(`https://digi-api.com/api/v1/digimon/${e.id}`);
      const d = await res.json();
      htmlNext += `
        <div class="evolucionCard">
          <img src="${d.images?.[0]?.href || ''}" alt="${d.name}" title="${d.name}" />
          <p>${d.name}</p>
        </div>
      `;
    }


    const digimonHtml = `
<div class="digimonDetalles">
  <h1 class="titulo">${digimon.name}</h1>
  <img src="${digimon.images?.[0]?.href || ''}" alt="${digimon.name}" />
  <p class="stat"><strong>ID:</strong> ${digimon.id}</p>
  <p class="stat"><strong>Nivel:</strong> ${digimon.levels?.[0]?.level || 'Desconocido'}</p>
  <p class="stat"><strong>Tipo:</strong> ${tiposHtml || 'Desconocido'}</p>
  <p><strong>Descripción:</strong> ${descripcion || 'No disponible'}</p>
  <h3 class="stat">Habilidades:</h3>
  <div class = "abilities">
    ${habilidadesHtml}
    </div>
    <h3 class="stat">Fields:</h3>
    <div class = "fields">${fieldsHtml}</div>
    <div class="contenedorEvoluciones">
          <h2 class="stat">Evoluciones Previas</h2>
      <div class="evoluciones">${htmlPrev}</div>
      <h2 class="stat">Digimon Actual</h2>
        <div class = "evoluciones">
        <img class ="evoluciones" src="${digimon.images?.[0]?.href || ''}" alt="${digimon.name}" />
        </div>
      <h2 class="stat">Siguientes Evoluciones</h2>
      <div class="evoluciones">${htmlNext}</div>
      </div>
</div>
    `;

    detalle.innerHTML = digimonHtml;

  } catch (error) {
    document.getElementById('detalle').innerHTML = `<p>Error al cargar el Digimon.</p>`;
    console.error(error);
  }
}


cargarDetalle(id);

const btnVolver = document.getElementById('botonVolver');

btnVolver.addEventListener('click' , () => {
      window.location.href = 'index.html';
})