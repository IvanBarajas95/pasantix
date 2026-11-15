# ENDPOINTS – API del proyecto Pasantix

**URL base:** `http://localhost:3000/api`
**Formato:** JSON · **Autenticación:** encabezado `Authorization: Bearer <token>` (se obtiene en `/auth/login`)

Todas las respuestas tienen la forma:
```json
{ "exito": true, "mensaje": "texto", "datos": { } }
```
En los errores de validación se agrega `"detalles": ["error 1", "error 2"]`.

## 1. Autenticación
| Método | Endpoint | Token | Descripción | Respuestas |
|---|---|---|---|---|
| POST | `/auth/registro` | No | Registra un APRENDIZ o una EMPRESA | 201, 400, 409 |
| POST | `/auth/login` | No | Inicia sesión y devuelve el token JWT | 200, 400, 401 |
| GET | `/auth/perfil` | Sí | Datos del usuario autenticado y de su perfil (aprendiz o empresa) | 200, 401 |

Cuerpo de registro de **aprendiz** (pantalla "Registro de Aprendiz"):
```json
{
  "rol": "APRENDIZ",
  "nombres": "Mateo",
  "apellidos": "Ríos Cárdenas",
  "documento": "1012345678",
  "programa": "Análisis y Desarrollo de Software",
  "ciudad": "Bogotá",
  "correo": "mateo@soy.sena.edu.co",
  "contrasena": "Segura2026*"
}
```
Cuerpo de registro de **empresa**:
```json
{ "rol": "EMPRESA", "razon_social": "Innovación Digital S.A.S.", "nit": "901234567-8", "ciudad": "Bogotá", "correo": "talento@innovacion.co", "contrasena": "Segura2026*" }
```
Validaciones: nombres y apellidos solo letras (2-80), documento solo números (6-10 dígitos), programa 3-120, ciudad solo letras, correo válido, contraseña de 8+ caracteres con mayúscula, número y carácter especial, NIT `900123456-1`.
Cuerpo de login:
```json
{ "correo": "talento@andinasti.co", "contrasena": "Pasantix2026*" }
```

## 2. Ofertas
| Método | Endpoint | Token / Rol | Descripción |
|---|---|---|---|
| GET | `/ofertas` | No | Lista ofertas. Filtros opcionales: `?estado=ABIERTA&modalidad=REMOTA&empresa=1&buscar=web` |
| GET | `/ofertas/:id` | No | Obtiene una oferta |
| POST | `/ofertas` | EMPRESA, ADMIN | Crea una oferta (ADMIN debe enviar `id_empresa`) |
| PUT | `/ofertas/:id` | EMPRESA (propia), ADMIN | Actualiza una oferta |
| DELETE | `/ofertas/:id` | EMPRESA (propia), ADMIN | Elimina una oferta |

Cuerpo:
```json
{
  "titulo": "Aprendiz de Desarrollo Móvil",
  "descripcion": "Apoyo en el desarrollo de aplicaciones móviles.",
  "area": "Desarrollo de software",
  "modalidad": "REMOTA",
  "cupos": 2,
  "fecha_publicacion": "2026-10-23",
  "fecha_cierre": "2026-12-20",
  "estado": "ABIERTA"
}
```
Validaciones: título 5-120, descripción 10-2000, área 3-80, modalidad `PRESENCIAL|REMOTA|HIBRIDA`, cupos entero 1-50, fechas `AAAA-MM-DD` reales, cierre ≥ publicación.

## 3. Postulaciones
| Método | Endpoint | Token / Rol | Descripción |
|---|---|---|---|
| GET | `/postulaciones` | Sí | Aprendiz: las suyas · Empresa: las de sus ofertas · Admin: todas |
| GET | `/postulaciones/:id` | Sí | Obtiene una postulación |
| POST | `/postulaciones` | APRENDIZ | `{ "id_oferta": 1, "comentario": "..." }` (no permite duplicadas ni ofertas cerradas) |
| PATCH | `/postulaciones/:id/estado` | EMPRESA, ADMIN | `{ "estado": "ACEPTADA" }` (`PENDIENTE|ACEPTADA|RECHAZADA`) |
| DELETE | `/postulaciones/:id` | Sí (aprendiz solo las propias) | Elimina / retira una postulación |

## 4. Empresas
| Método | Endpoint | Token / Rol | Descripción |
|---|---|---|---|
| GET | `/empresas` | No | Lista empresas |
| GET | `/empresas/:id` | No | Obtiene una empresa |
| POST | `/empresas` | ADMIN | Crea empresa |
| PUT | `/empresas/:id` | ADMIN | Actualiza empresa |
| DELETE | `/empresas/:id` | ADMIN | Elimina empresa (y sus ofertas) |

Cuerpo: `{ "nit": "900123456-1", "razon_social": "...", "sector": "...", "correo": "...", "telefono": "6015550101", "ciudad": "Bogotá" }`

## 5. Aprendices
| Método | Endpoint | Token / Rol | Descripción |
|---|---|---|---|
| GET | `/aprendices` | ADMIN, EMPRESA | Lista aprendices |
| GET | `/aprendices/:id` | Sí | Obtiene un aprendiz |
| POST | `/aprendices` | ADMIN | Crea aprendiz |
| PUT | `/aprendices/:id` | ADMIN | Actualiza aprendiz |
| DELETE | `/aprendices/:id` | ADMIN | Elimina aprendiz |

Cuerpo: `{ "nombres": "Mateo", "apellidos": "Ríos Cárdenas", "documento": "1012345678", "correo": "...", "telefono": "3015556677", "programa": "...", "ficha": "3336169", "ciudad": "Bogotá" }`

## Códigos HTTP usados
| Código | Significado |
|---|---|
| 200 | Operación exitosa |
| 201 | Registro creado |
| 400 | Datos inválidos o JSON mal formado |
| 401 | Falta el token / credenciales incorrectas |
| 403 | El rol no tiene permiso |
| 404 | Recurso o ruta no encontrada |
| 409 | Registro duplicado |
| 500 | Error interno |
