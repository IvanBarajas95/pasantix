![Pasantix – Conectando aprendices con oportunidades reales](docs/banner-pasantix.png)

# Pasantix

**Conectando aprendices con oportunidades reales.**

## Problema

Hay aprendices que ya tuvieron **contrato de aprendizaje** en un programa (por ejemplo, Panadería) y luego se cambiaron a otro programa no relacionado (por ejemplo, Análisis y Desarrollo de Software). Un segundo contrato de aprendizaje solo es posible cuando los programas están relacionados (por ejemplo, Técnico en Panadería y luego Tecnólogo en Procesamiento de Alimentos). Al haber agotado el contrato, a estos aprendices se les dificulta encontrar dónde hacer su **etapa productiva**, porque la mayoría de las empresas buscan aprendices bajo la modalidad de contrato de aprendizaje.

## Solución

Pasantix es una solución tecnológica diseñada para cerrar la brecha entre estudiantes que han agotado su contrato de aprendizaje y empresas que requieren talento técnico bajo la modalidad de pasantía. El modelo de negocio se basa en la eficiencia operativa mediante el uso de software de código abierto y hardware optimizado.

| | |
|---|---|
| **Aprendiz** | Iván Antonio Ovalle Barajas |
| **Instructor** | Francisco Arnaldo Vargas Bermudez |
| **Programa** | Análisis y Desarrollo de Software (ADSO) · Ficha 3336169 · SENA Regional Distrito Capital |
| **Guía** | GA7 – Competencia 220501096 · Desarrollar la solución de software de acuerdo con el diseño y metodologías de desarrollo |

## Estructura del repositorio

| Carpeta | Tecnología | Qué contiene | Evidencias |
|---|---|---|---|
| `database/` | MySQL / MariaDB | Script `pasantix.sql` con tablas y datos de prueba | Todas |
| `modulo-java/` | Java 17, JDBC, Servlets, JSP, Maven | Módulo de gestión de empresas (consola + web) | AA2-EV01, AA2-EV02 |
| `backend/` | Node.js, Express, MySQL, JWT | API REST del proyecto (patrón MVC) | AA3-EV01, AA5-EV04 |
| `frontend/` | React 18, Vite, React Router | Interfaz web: bienvenida, inicio de sesión, registro, panel del aprendiz y panel de la empresa | AA4-EV03 |
| `servicio-login-caso/` | Node.js, Express, MySQL, bcrypt | Servicio web de registro e inicio de sesión | AA5-EV01, AA5-EV02 |

## Modelo de datos

`usuarios` · `empresas` · `aprendices` · `ofertas` · `postulaciones`
(Una **empresa** publica **ofertas**; un **aprendiz** se **postula** a una oferta.)

## Tecnologías de código abierto

Todo el proyecto usa software libre o de código abierto (Node.js, Express, React, Vite, MySQL/MariaDB, OpenJDK, Jetty, Git), lo que reduce costos de licencias y permite ejecutarlo en equipos de gama media, en línea con el modelo de negocio de eficiencia operativa.

## Requisitos

- Git 2.4x
- Node.js 20 LTS o superior
- XAMPP (MySQL/MariaDB encendido en el puerto 3306)
- JDK 21 + Apache NetBeans (o Maven 3.9) — solo para `modulo-java`
- Postman

## Cómo ejecutar (resumen)

```bash
# 1. Base de datos y API (puerto 3000)
cd backend
npm install
npm run db:init
npm start

# 2. Frontend React (puerto 5173) — en otra terminal
cd frontend
npm install
npm run dev

# 3. Servicio web del caso (puerto 4000) — en otra terminal
cd servicio-login-caso
npm install
npm start

# 4. Módulo Java (puerto 8080)
cd modulo-java
mvn jetty:run          # Web:     http://localhost:8080/pasantix
mvn compile exec:java  # Consola: menú CRUD con JDBC
```

Usuarios de prueba (contraseña `Pasantix2026*`):

| Rol | Correo |
|---|---|
| ADMIN | admin@pasantix.co |
| EMPRESA | talento@andinasti.co |
| APRENDIZ | laura.gomez@soy.sena.edu.co |

## Documentación adicional

- [Estándares de codificación](CONVENCIONES.md)
- [Endpoints de la API del proyecto](backend/docs/ENDPOINTS.md)
- [Endpoints del servicio de login (caso)](servicio-login-caso/ENDPOINTS.md)
- Colecciones de Postman: `backend/postman/` y `servicio-login-caso/postman/`
