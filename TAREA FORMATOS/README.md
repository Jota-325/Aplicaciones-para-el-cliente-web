# Registro de Estudiantes

Página web (HTML, CSS y JavaScript) para registrar estudiantes con validaciones por expresiones regulares y almacenamiento en `localStorage` en formato JSON.

## Campos
Cédula, apellidos, nombres, dirección, teléfono, correo electrónico, facultad, nivel y paralelo.

## Validaciones
| Campo | Regex / regla |
|---|---|
| Cédula | `/^[0-9]{10}$/` + dígito verificador (módulo 10) |
| Apellidos / Nombres | `/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/` |
| Dirección | `/^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ#.,\-\/\s]{5,100}$/` |
| Teléfono | `/^09[0-9]{8}$/` |
| Correo | `/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/` |
| Facultad, nivel, paralelo | Selección obligatoria |

## Almacenamiento
Clave `estudiantes` en localStorage:
```js
localStorage.setItem("estudiantes", JSON.stringify(lista));
JSON.parse(localStorage.getItem("estudiantes"));
```

## Ejecutar
Abrir `index.html` en el navegador (o con Live Server de VS Code). Cédula de prueba válida: `1710034065`.

## Autor
Jkpro325
