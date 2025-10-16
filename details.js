const detalle = document.getElementById('detalle');
const id = window.location.href.split('=')[1];

async function cargarDetalle(id) {
  try {
    const respuesta = await fetch(`https://digi-api.com/api/v1/digimon/${id}`);
    const digimon = await respuesta.json();

    const habilidadesHtml = digimon.skills?.length
      ? digimon.skills.map(s => `
        <p>
          <strong class="stat">${s.skill}:</strong> ${s.description || "No description"}
        </p>
      `).join('')
      : '<p>No hay habilidades registradas.</p>';

        const tiposHtml = digimon.types?.length
      ? digimon.types.map(t => t.type).join(', ')
      : 'Desconocido';

    const descripcion = digimon.descriptions?.[1]?.description || 'No disponible';

    const fieldsHtml = digimon.fields?.length
      ? digimon.fields.map(f => `
        <div class="fieldCard">
          <img src="${f.image}" alt="${f.field}" title="${f.field}" />
          <p>${f.field}</p>
        </div>
      `).join('')
      : '<p>No hay fields disponibles.</p>';

    let preEvos = '<p>No hay evoluciones previas.</p>';
    if (digimon.priorEvolutions?.length) {
      const previas = await Promise.all(
        digimon.priorEvolutions.map(async (e) => {
          const res = await fetch(`https://digi-api.com/api/v1/digimon/${e.id}`);
          return res.json();
        })
      );

      preEvos = previas.map(d => `
        <div class="evolucionCard">
          <img src="${d.images?.[0]?.href || ''}" alt="${d.name}" />
          <p>${d.name}</p>
        </div>
      `).join('');
    }

    let postEvos = '<p>No hay evoluciones posteriores.</p>';
    if (digimon.nextEvolutions?.length) {
      const post = await Promise.all(
        digimon.nextEvolutions.map(async (e) => {
          const res = await fetch(`https://digi-api.com/api/v1/digimon/${e.id}`);
          return res.json();
        })
      );

      postEvos = post.map(d => `
        <div class="evolucionCard">
          <img src="${d.images?.[0]?.href || ''}" alt="${d.name}" />
          <p>${d.name}</p>
        </div>
      `).join('');
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
      <div class="evoluciones">${preEvos}</div>
      <h2 class="stat">Digimon Actual</h2>
        <div class = "evoluciones">
        <img class ="evoluciones" src="${digimon.images?.[0]?.href || ''}" alt="${digimon.name}" />
        </div>
      <h2 class="stat">Siguientes Evoluciones</h2>
      <div class="evoluciones">${postEvos}</div>
      </div>
</div>
    `;

    detalle.innerHTML = digimonHtml;

  } catch (error) {
    document.getElementById('detalle').innerHTML = `<p>Error al cargar el Digimon.</p>`;
    console.error(error);
  }
}
const botonVolver = document.createElement('a');
botonVolver.href = 'index.html';
botonVolver.id = 'botonVolver';
botonVolver.classList.add('botonVolver');
botonVolver.textContent = '🔙';

document.body.appendChild(botonVolver);

cargarDetalle(id);

