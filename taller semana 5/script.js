const formulario = document.getElementById('formulario');
const mensaje = document.getElementById('mensaje');
const lista = document.getElementById('lista-clientes');
const contador = document.getElementById('contador');
const sinClientes = document.getElementById('sin-clientes');
const botonExportar = document.getElementById('exportar');
const CLAVE = 'clientes_registrados';
localStorage.removeItem('clientes_registrados');
function cargarClientes() {
  try {
    const guardados = JSON.parse(localStorage.getItem(CLAVE) || '[]');
    return Array.isArray(guardados) ? guardados : [];
  } catch (error) {
    return [];
  }
}

let clientes = cargarClientes();

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = 'mensaje ' + tipo;
}

function mostrarClientes() {
  lista.replaceChildren();
  clientes.forEach(cliente => {
    const fila = document.createElement('tr');
    ['cedula', 'nombre', 'direccion', 'telefono', 'correo'].forEach(campo => {
      const celda = document.createElement('td');
      celda.textContent = cliente[campo];
      fila.appendChild(celda);
    });
    lista.appendChild(fila);
  });
  contador.textContent = clientes.length;
  sinClientes.hidden = clientes.length > 0;
  botonExportar.disabled = clientes.length === 0;
}

formulario.addEventListener('submit', evento => {
  evento.preventDefault();
  const cliente = Object.fromEntries(
    ['cedula', 'nombre', 'direccion', 'telefono', 'correo'].map(campo => [
      campo, document.getElementById(campo).value.trim()
    ])
  );

  let error = '';
  if (!/^\d{10}$/.test(cliente.cedula)) {
    error = 'La cédula debe contener exactamente 10 dígitos.';
  } else if (!cliente.nombre || cliente.nombre.length > 30) {
    error = 'El nombre es obligatorio y admite máximo 30 caracteres.';
  } else if (!cliente.direccion || cliente.direccion.length > 50) {
    error = 'La dirección es obligatoria y admite máximo 50 caracteres.';
  } else if (!/^\d{10}$/.test(cliente.telefono)) {
    error = 'El celular debe contener exactamente 10 dígitos.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.correo)) {
    error = 'Ingresa un correo electrónico válido.';
  } else if (clientes.some(item => item.cedula === cliente.cedula)) {
    error = 'Ya existe un cliente registrado con esa cédula.';
  }

  if (error) {
    mostrarMensaje(error, 'error');
    return;
  }

  try {
    localStorage.setItem(CLAVE, JSON.stringify([...clientes, cliente]));
    clientes.push(cliente);
    mostrarClientes();
    mostrarMensaje('Cliente registrado correctamente.', 'exito');
    formulario.reset();
  } catch (errorGuardado) {
    mostrarMensaje('No se pudo guardar en este navegador. Revisa el almacenamiento o usa un servidor local.', 'error');
  }
});

botonExportar.addEventListener('click', () => {
  const archivo = new Blob([JSON.stringify(clientes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = 'clientes.json';
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

mostrarClientes();
