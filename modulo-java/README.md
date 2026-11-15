# Módulo Java de empresas – Pasantix

CRUD de la tabla `empresas` con **JDBC** (consola) y con **Servlets + JSP** (web).

| Paquete | Responsabilidad |
|---|---|
| `co.edu.sena.pasantix.conexion` | `ConexionBD`: conexión JDBC (lee `db.properties`) |
| `co.edu.sena.pasantix.modelo` | `Empresa`: clase POJO |
| `co.edu.sena.pasantix.dao` | `EmpresaDAO` (interfaz) y `EmpresaDAOImpl` (JDBC) |
| `co.edu.sena.pasantix.util` | `ValidadorEmpresa`, `HtmlUtil` |
| `co.edu.sena.pasantix.vista` | `MenuConsolaEmpresas`: aplicación stand-alone |
| `co.edu.sena.pasantix.controlador` | `EmpresaServlet`: atiende GET y POST |

Ejecutar (con MySQL de XAMPP encendido y la base `pasantix` creada):
```bash
mvn compile exec:java   # menú de consola
mvn jetty:run           # web en http://localhost:8080/pasantix
```
En NetBeans: abrir la carpeta `modulo-java` y presionar **Run** (▶).
