// 1. ESTADO DE LA APLICACIÓN
let libros = [];
let estaEditando = false;
let errorCarga = '';
try {
  const datos = JSON.parse(localStorage.getItem('listaLibros'));
  if (Array.isArray(datos)) {
    libros = datos.filter(libro => libro && typeof libro.id === 'string' &&
      typeof libro.titulo === 'string' && typeof libro.autor === 'string');
  }
} catch (error) {
  errorCarga = 'No se pudieron cargar los datos guardados. Puedes trabajar en esta sesión.';
}

// 2. ELEMENTOS DEL DOM
const formulario = document.getElementById('formulario-crud');
const entradaTitulo = document.getElementById('titulo');
const entradaAutor = document.getElementById('autor');
const entradaId = document.getElementById('id-elemento');
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const botonGuardar = document.getElementById('boton-guardar');
const botonCancelar = document.getElementById('boton-cancelar');
const mensaje = document.getElementById('mensaje');

// 3. FUNCIONES OPERATIVAS (CRUD)
function guardarLibros() {
  try {
    localStorage.setItem('listaLibros', JSON.stringify(libros));
    mensaje.textContent = '';
  } catch (error) {
    mensaje.textContent = 'Los cambios están en memoria, pero no se pudieron guardar en este navegador.';
  }
}

// LEER: textContent evita interpretar los títulos y autores como HTML.
function renderizarLibros() {
  cuerpoTabla.replaceChildren();
  if (libros.length === 0) {
    const fila = document.createElement('tr');
    const celda = document.createElement('td');
    celda.colSpan = 3;
    celda.className = 'vacio';
    celda.textContent = 'No hay libros registrados.';
    fila.appendChild(celda);
    cuerpoTabla.appendChild(fila);
    return;
  }
  libros.forEach(libro => {
    const fila = document.createElement('tr');
    const titulo = document.createElement('td');
    const autor = document.createElement('td');
    const acciones = document.createElement('td');
    const grupo = document.createElement('div');
    grupo.className = 'acciones';
    titulo.textContent = libro.titulo;
    autor.textContent = libro.autor;
    const editar = document.createElement('button');
    editar.type = 'button';
    editar.className = 'btn-editar';
    editar.textContent = 'Editar';
    editar.addEventListener('click', () => prepararEdicion(libro.id));
    const eliminar = document.createElement('button');
    eliminar.type = 'button';
    eliminar.className = 'btn-eliminar';
    eliminar.textContent = 'Eliminar';
    eliminar.addEventListener('click', () => eliminarLibro(libro.id));
    grupo.append(editar, eliminar);
    acciones.appendChild(grupo);
    fila.append(titulo, autor, acciones);
    cuerpoTabla.appendChild(fila);
  });
}

function crearId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  let id;
  do {
    id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  } while (libros.some(libro => libro.id === id));
  return id;
}

// CREAR Y ACTUALIZAR
formulario.addEventListener('submit', evento => {
  evento.preventDefault();
  const valorTitulo = entradaTitulo.value.trim();
  const valorAutor = entradaAutor.value.trim();
  const idActual = entradaId.value;
  if (!valorTitulo || !valorAutor) {
    mensaje.textContent = 'Escribe un título y un autor; no se aceptan campos con solo espacios.';
    (!valorTitulo ? entradaTitulo : entradaAutor).focus();
    return;
  }
  if (estaEditando) {
    libros = libros.map(libro => libro.id === idActual
      ? { ...libro, titulo: valorTitulo, autor: valorAutor } : libro);
  } else {
    libros.push({ id: crearId(), titulo: valorTitulo, autor: valorAutor });
  }
  reiniciarFormulario();
  guardarLibros();
  renderizarLibros();
});

function prepararEdicion(id) {
  const libroEncontrado = libros.find(libro => libro.id === id);
  if (!libroEncontrado) return;
  entradaTitulo.value = libroEncontrado.titulo;
  entradaAutor.value = libroEncontrado.autor;
  entradaId.value = libroEncontrado.id;
  estaEditando = true;
  botonGuardar.textContent = 'Actualizar Libro';
  botonCancelar.classList.remove('oculto');
  entradaTitulo.focus();
}

// ELIMINAR
function eliminarLibro(id) {
  if (!confirm('¿Está seguro de que desea eliminar este libro?')) return;
  libros = libros.filter(libro => libro.id !== id);
  if (estaEditando && entradaId.value === id) reiniciarFormulario();
  guardarLibros();
  renderizarLibros();
}

function reiniciarFormulario() {
  formulario.reset();
  entradaId.value = '';
  estaEditando = false;
  botonGuardar.textContent = 'Guardar Libro';
  botonCancelar.classList.add('oculto');
  mensaje.textContent = '';
}
botonCancelar.addEventListener('click', reiniciarFormulario);

// 4. INICIALIZACIÓN
renderizarLibros();
mensaje.textContent = errorCarga;
