(function () {
  "use strict";

  var CLAVE = "estudiantes";

  var regexCedula    = /^[0-9]{10}$/;
  var regexLetras    = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
  var regexDireccion = /^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ#.,\-\/\s]{5,100}$/;
  var regexTelefono  = /^09[0-9]{8}$/;
  var regexCorreo    = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  function $(id) { return document.getElementById(id); }

  function cedulaEcuatorianaValida(ced) {
    var prov = parseInt(ced.substring(0, 2), 10);
    if (!((prov >= 1 && prov <= 24) || prov === 30)) return false;
    if (parseInt(ced.charAt(2), 10) > 5) return false;
    var coef = [2, 1, 2, 1, 2, 1, 2, 1, 2], suma = 0;
    for (var i = 0; i < 9; i++) {
      var p = parseInt(ced.charAt(i), 10) * coef[i];
      if (p > 9) p -= 9;
      suma += p;
    }
    var verificador = (10 - (suma % 10)) % 10;
    return verificador === parseInt(ced.charAt(9), 10);
  }

  function leer() {
    try {
      var datos = localStorage.getItem(CLAVE);
      if (!datos) return [];
      var lista = JSON.parse(datos);
      return Array.isArray(lista) ? lista : [];
    } catch (e) {
      return [];
    }
  }

  function guardar(lista) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(lista));
      return true;
    } catch (e) {
      mostrarAviso("No se pudo guardar en localStorage: " + e.message);
      return false;
    }
  }

  function mostrarAviso(texto) {
    var a = $("aviso");
    a.textContent = texto;
    a.hidden = false;
  }

  function mensaje(texto, esError) {
    var m = $("mensaje");
    m.textContent = texto;
    m.style.color = esError ? "red" : "green";
  }

  function escapar(t) {
    return String(t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function marcar(idCampo, idError, texto) {
    $(idError).textContent = texto;
    var campo = $(idCampo);
    if (texto) campo.classList.add("invalido"); else campo.classList.remove("invalido");
    return texto === "";
  }

  function validarTexto(idCampo, idError, regex, textoError) {
    var v = $(idCampo).value.trim();
    if (v === "") return marcar(idCampo, idError, "Este campo es obligatorio.");
    if (!regex.test(v)) return marcar(idCampo, idError, textoError);
    return marcar(idCampo, idError, "");
  }

  function validarSelect(idCampo, idError) {
    if ($(idCampo).value === "") return marcar(idCampo, idError, "Debe seleccionar una opción.");
    return marcar(idCampo, idError, "");
  }

  function validarCedula() {
    var v = $("cedula").value.trim();
    if (v === "") return marcar("cedula", "errorCedula", "Este campo es obligatorio.");
    if (!regexCedula.test(v)) return marcar("cedula", "errorCedula", "Debe tener exactamente 10 dígitos numéricos.");
    if (!cedulaEcuatorianaValida(v)) return marcar("cedula", "errorCedula", "La cédula no es válida (dígito verificador incorrecto).");
    return marcar("cedula", "errorCedula", "");
  }

  function validarTodo() {
    var r = [
      validarCedula(),
      validarTexto("apellidos", "errorApellidos", regexLetras, "Solo letras y espacios simples."),
      validarTexto("nombres", "errorNombres", regexLetras, "Solo letras y espacios simples."),
      validarTexto("direccion", "errorDireccion", regexDireccion, "De 5 a 100 caracteres (letras, números, # . , - /)."),
      validarTexto("telefono", "errorTelefono", regexTelefono, "Debe iniciar con 09 y tener 10 dígitos."),
      validarTexto("correo", "errorCorreo", regexCorreo, "Correo electrónico no válido."),
      validarSelect("facultad", "errorFacultad"),
      validarSelect("nivel", "errorNivel"),
      validarSelect("paralelo", "errorParalelo")
    ];
    return r.every(function (x) { return x; });
  }

  function limpiarErrores() {
    document.querySelectorAll(".error").forEach(function (e) { e.textContent = ""; });
    document.querySelectorAll(".invalido").forEach(function (e) { e.classList.remove("invalido"); });
  }

  function dibujar() {
    var lista = leer();
    var tbody = $("tablaEstudiantes");
    var filas = "";
    lista.forEach(function (e) {
      filas += "<tr>" +
        "<td>" + escapar(e.cedula) + "</td>" +
        "<td>" + escapar(e.apellidos) + "</td>" +
        "<td>" + escapar(e.nombres) + "</td>" +
        "<td>" + escapar(e.direccion) + "</td>" +
        "<td>" + escapar(e.telefono) + "</td>" +
        "<td>" + escapar(e.correo) + "</td>" +
        "<td>" + escapar(e.facultad) + "</td>" +
        "<td>" + escapar(e.nivel) + "</td>" +
        "<td>" + escapar(e.paralelo) + "</td>" +
        '<td><button type="button" class="btnEliminar" data-cedula="' + escapar(e.cedula) + '">Eliminar</button></td>' +
        "</tr>";
    });
    tbody.innerHTML = filas;
    $("contador").textContent = lista.length;
    $("visorJson").textContent = JSON.stringify(lista, null, 2);
  }

  function limpiarFormulario() {
    $("formularioEstudiante").reset();
    limpiarErrores();
  }

  function alEnviar(ev) {
    ev.preventDefault();
    if (!validarTodo()) {
      mensaje("Corrija los errores antes de guardar.", true);
      return;
    }
    var lista = leer();
    var cedula = $("cedula").value.trim();
    var repetida = lista.some(function (e) { return e.cedula === cedula; });
    if (repetida) {
      marcar("cedula", "errorCedula", "Ya existe un estudiante con esta cédula.");
      mensaje("La cédula ya está registrada.", true);
      return;
    }
    lista.push({
      cedula: cedula,
      apellidos: $("apellidos").value.trim(),
      nombres: $("nombres").value.trim(),
      direccion: $("direccion").value.trim(),
      telefono: $("telefono").value.trim(),
      correo: $("correo").value.trim(),
      facultad: $("facultad").value,
      nivel: $("nivel").value,
      paralelo: $("paralelo").value
    });
    if (guardar(lista)) {
      limpiarFormulario();
      dibujar();
      mensaje("Estudiante registrado correctamente.", false);
    } else {
      mensaje("Error: no se pudo guardar.", true);
    }
  }

  function alClicTabla(ev) {
    var b = ev.target;
    if (!b.classList || !b.classList.contains("btnEliminar")) return;
    var cedula = b.getAttribute("data-cedula");
    var nueva = leer().filter(function (e) { return e.cedula !== cedula; });
    if (guardar(nueva)) {
      dibujar();
      mensaje("Estudiante eliminado.", false);
    }
  }

  function iniciar() {
    try {
      localStorage.setItem("__prueba__", "1");
      localStorage.removeItem("__prueba__");
    } catch (e) {
      mostrarAviso("Tu navegador bloquea localStorage. Abre la página con Live Server (http://localhost) o usa otro navegador.");
    }
    $("formularioEstudiante").addEventListener("submit", alEnviar);
    $("btnLimpiar").addEventListener("click", function () { limpiarFormulario(); mensaje("", false); });
    $("tablaEstudiantes").addEventListener("click", alClicTabla);
    dibujar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
