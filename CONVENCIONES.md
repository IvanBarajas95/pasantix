# Estándares de codificación – Pasantix

Estos estándares se aplican en todo el código del repositorio.

## Reglas generales
- Nombres **en español**, descriptivos y sin abreviaturas confusas (`fechaCierre`, no `fc`).
- Indentación de **2 espacios** en JavaScript/JSX y **4 espacios** en Java.
- Cada archivo inicia con un **comentario de cabecera** (archivo, propósito, autor).
- Funciones y métodos pequeños, con una sola responsabilidad.
- Nunca se guardan contraseñas en texto plano (se usa **bcrypt**) ni se suben archivos `.env` al repositorio.
- Todas las consultas SQL usan **parámetros** (`?` / `PreparedStatement`) para evitar inyección SQL.

## Nombramiento

| Elemento | Java | JavaScript / React | Ejemplo |
|---|---|---|---|
| Paquetes / carpetas | minúsculas, dominio invertido | minúsculas | `co.edu.sena.pasantix.dao`, `src/controllers` |
| Clases / componentes | PascalCase (sustantivo) | PascalCase | `EmpresaDAOImpl`, `TarjetaOferta` |
| Interfaces | PascalCase | — | `EmpresaDAO` |
| Métodos / funciones | camelCase (verbo) | camelCase (verbo) | `buscarPorId()`, `crearOferta()` |
| Variables | camelCase | camelCase | `idEmpresa`, `ofertaEditar` |
| Constantes | MAYÚSCULAS_CON_GUION | MAYÚSCULAS_CON_GUION | `SQL_INSERTAR`, `URL_BASE` |
| Hooks de React | — | `use` + nombre | `useFormulario`, `useAutenticacion` |
| Tablas y columnas SQL | — | snake_case en plural | `postulaciones`, `fecha_cierre` |
| Rutas de la API | — | sustantivos en plural, minúscula | `/api/ofertas/:id` |

## Commits (Git)
Formato: `tipo: descripción corta en presente`
- `feat:` nueva funcionalidad · `fix:` corrección · `docs:` documentación · `test:` pruebas · `chore:` configuración
- Ejemplo: `feat: agregar CRUD de ofertas en la API`
