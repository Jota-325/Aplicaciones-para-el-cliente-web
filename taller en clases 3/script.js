
const formulario = document.getElementById('formulario');
const lista = document.getElementById('lista-resultados');
const mensaje = document.getElementById('mensaje');

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const a = Number(document.getElementById('numero1').value);
  const b = Number(document.getElementById('numero2').value);
  lista.replaceChildren();
  mensaje.hidden = true;

  for (let i = 1; i <= 5; i++) {
    let nombre;
    let expresion;
    let resultado;
    let error = false;

    switch (i) {
      case 1:
        nombre = 'Suma';
        expresion = `${a} + ${b}`;
        resultado = a + b;
        break;
      case 2:
        nombre = 'Resta';
        expresion = `${a} - ${b}`;
        resultado = a - b;
        break;
      case 3:
        nombre = 'Multiplicación';
        expresion = `${a} × ${b}`;
        resultado = a * b;
        break;
      case 4:
        nombre = 'División';
        expresion = `${a} ÷ ${b}`;
        error = b === 0;
        resultado = error ? 'No se puede dividir entre cero' : a / b;
        break;
      case 5:
        nombre = 'Módulo';
        expresion = `${a} % ${b}`;
        error = b === 0;
        resultado = error ? 'No se puede calcular con divisor cero' : a % b;
        break;
    }

    const item = document.createElement('li');
    item.className = error ? 'resultado error' : 'resultado';
    const detalle = document.createElement('div');
    detalle.className = 'detalle';
    const paso = document.createElement('span');
    paso.className = 'paso';
    paso.textContent = `ITERACIÓN ${i} · ${nombre.toUpperCase()}`;
    const operacion = document.createElement('span');
    operacion.className = 'operacion';
    operacion.textContent = expresion;
    const valor = document.createElement('span');
    valor.className = 'valor';
    valor.textContent = error ? resultado : `= ${resultado}`;
    detalle.append(paso, operacion);
    item.append(detalle, valor);
    lista.appendChild(item);
  }
});
