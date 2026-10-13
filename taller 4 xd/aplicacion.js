// 1. Referencias al DOM
const formularioTareas = document.getElementById('formulario-tareas');
const tituloTarea = document.getElementById('titulo-tarea');
const descripcionTarea = document.getElementById('descripcion-tarea');
const listaTareas = document.getElementById('lista-tareas');

const btnExportarJson = document.getElementById('btn-exportar-json');
const btnExportarXml = document.getElementById('btn-exportar-xml');

// 2. Estado de la aplicación
let coleccionTareas = JSON.parse(localStorage.getItem('tareasGuardadas')) || [];

// 3. Pintar las tareas en el HTML
function redibujarInterfaz() {
    listaTareas.innerHTML = '';

    coleccionTareas.forEach((tarea, indice) => {
        const elementoLista = document.createElement('li');
        elementoLista.className = 'elemento-tarea';

        elementoLista.innerHTML = `
            <div>
                <h3>${tarea.titulo}</h3>
                <p>${tarea.descripcion}</p>
                <small style="color: #94a3b8;">Código: ${tarea.codigo} | Registro: ${tarea.fecha}</small>
            </div>
            <button class="btn-eliminar" onclick="removerTarea(${indice})">Eliminar</button>
        `;
        listaTareas.appendChild(elementoLista);
    });
}

// 4. Guardar en LocalStorage como JSON
function actualizarAlmacenamientoLocal() {
    localStorage.setItem('tareasGuardadas', JSON.stringify(coleccionTareas));
}

// 5. Evento de envío del formulario
formularioTareas.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nuevaTarea = {
        codigo: Date.now().toString(),
        titulo: tituloTarea.value,
        descripcion: descripcionTarea.value,
        fecha: new Date().toLocaleDateString()
    };

    coleccionTareas.push(nuevaTarea);
    actualizarAlmacenamientoLocal();
    redibujarInterfaz();

    formularioTareas.reset();
});

// 6. Eliminar tarea por índice
window.removerTarea = function(indice) {
    coleccionTareas.splice(indice, 1);
    actualizarAlmacenamientoLocal();
    redibujarInterfaz();
};

// ===== FORMATOS SEMIESTRUCTURADOS (XML y JSON) =====

btnExportarJson.addEventListener('click', () => {
    if (coleccionTareas.length === 0) return alert('No existen tareas para exportar.');

    const textoJson = JSON.stringify(coleccionTareas, null, 2);

    console.log("--- FLUJO DE DATOS: JSON GENERADO ---");
    console.log(textoJson);

    generarDescarga(textoJson, 'tareas_academicas.json', 'application/json');
});

btnExportarXml.addEventListener('click', () => {
    if (coleccionTareas.length === 0) return alert('No existen tareas para exportar.');

    let textoXml = `<?xml version="1.0" encoding="UTF-8"?>\n<tareas>\n`;

    coleccionTareas.forEach(tarea => {
        textoXml += `  <tarea codigo="${tarea.codigo}">\n`;
        textoXml += `    <titulo>${sanitizarTextoXml(tarea.titulo)}</titulo>\n`;
        textoXml += `    <descripcion>${sanitizarTextoXml(tarea.descripcion)}</descripcion>\n`;
        textoXml += `    <fecha>${tarea.fecha}</fecha>\n`;
        textoXml += `  </tarea>\n`;
    });

    textoXml += `</tareas>`;

    console.log("--- FLUJO DE DATOS: XML GENERADO ---");
    console.log(textoXml);

    generarDescarga(textoXml, 'tareas_academicas.xml', 'application/xml');
});

function generarDescarga(contenidoTexto, nombreArchivo, tipoMime) {
    const bloqueDatos = new Blob([contenidoTexto], { type: tipoMime });
    const urlDescarga = URL.createObjectURL(bloqueDatos);
    const enlaceDescarga = document.createElement('a');

    enlaceDescarga.href = urlDescarga;
    enlaceDescarga.download = nombreArchivo;
    enlaceDescarga.click();

    URL.revokeObjectURL(urlDescarga);
}

function sanitizarTextoXml(textoInseguro) {
    return textoInseguro.replace(/[<>&'"]/g, (caracter) => {
        switch (caracter) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

// 7. Renderizado inicial
redibujarInterfaz();
