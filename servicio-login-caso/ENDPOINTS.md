# ENDPOINTS – Servicio web de registro e inicio de sesión (Caso)

**URL base:** `http://localhost:4000/api` · **Formato:** JSON
La base de datos `login_caso` y la tabla `usuarios` se crean solas al iniciar (`npm start`).

| Método | Endpoint | Cuerpo | Respuesta correcta | Errores |
|---|---|---|---|---|
| GET | `/api` | — | 200 "Servicio de login funcionando." | — |
| POST | `/api/registro` | `{ "usuario": "ivan.ovalle", "contrasena": "MiClave2026*" }` | 201 "Registro exitoso." | 400 datos inválidos · 409 usuario ya existe |
| POST | `/api/login` | `{ "usuario": "ivan.ovalle", "contrasena": "MiClave2026*" }` | 200 **"Autenticación satisfactoria."** | 401 **"Error en la autenticación."** · 400 faltan datos |
| GET | `/api/usuarios` | — | 200 lista de usuarios (sin contraseñas) | — |

Reglas: usuario de 4 a 30 caracteres (letras, números, punto o guion bajo); contraseña de 8 a 64 caracteres. Las contraseñas se guardan cifradas con **bcrypt**.
