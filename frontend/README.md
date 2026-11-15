# Frontend React – Pasantix

Interfaz web de Pasantix con la identidad visual del proyecto (azul marino, bordes cian y botones dorado/cian).

```bash
npm install
npm run dev   # http://localhost:5173
```
Requiere la API (`backend`) encendida en `http://localhost:3000`.

| Pantalla | Ruta | Quién la usa |
|---|---|---|
| Bienvenida | `/` | Todos |
| Inicio de sesión (Recordarme, Recuperar contraseña) | `/iniciar-sesion` | Todos |
| Registro (Soy Pasante / Soy Empresa) | `/registro` | Todos |
| Recuperar contraseña | `/recuperar-contrasena` | Todos |
| Oportunidades (búsqueda y filtros) | `/ofertas` | Todos |
| Mi panel | `/mi-panel` | Aprendiz |
| Mis postulaciones | `/mis-postulaciones` | Aprendiz |
| Panel de empresa (métricas, candidatos, ofertas) | `/panel-empresa` | Empresa / Administrador |

Componentes reutilizables: `Logo`, `Icono`, `Encabezado`, `PiePagina`, `CampoFormulario`, `CampoContrasena`,
`SelectorRol`, `TarjetaOferta`, `FiltroOfertas`, `FormularioOferta`, `TarjetaMetrica`, `InsigniaEstado`, `Alerta`,
`Cargando`, `IlustracionBienvenida`, `RutaProtegida` y `LimiteErrores` (componente de clase).
