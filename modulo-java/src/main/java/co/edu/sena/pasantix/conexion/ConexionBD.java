package co.edu.sena.pasantix.conexion;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * Clase utilitaria que entrega conexiones JDBC a la base de datos "pasantix".
 * Lee los datos de conexión del archivo db.properties.
 *
 * @author Iván Antonio Ovalle Barajas
 * @version 1.0
 */
public final class ConexionBD {

    private static final String ARCHIVO_PROPIEDADES = "db.properties";
    private static final Properties PROPIEDADES = cargarPropiedades();

    /** Constructor privado: esta clase no se instancia. */
    private ConexionBD() {
    }

    /**
     * Carga db.properties desde el classpath. Las variables de entorno
     * PASANTIX_DB_URL, PASANTIX_DB_DRIVER, PASANTIX_DB_USUARIO y
     * PASANTIX_DB_CONTRASENA (opcionales) reemplazan los valores del archivo.
     */
    private static Properties cargarPropiedades() {
        Properties propiedades = new Properties();
        try (InputStream entrada = ConexionBD.class.getClassLoader().getResourceAsStream(ARCHIVO_PROPIEDADES)) {
            if (entrada == null) {
                throw new IllegalStateException("No se encontró el archivo " + ARCHIVO_PROPIEDADES);
            }
            propiedades.load(entrada);
        } catch (IOException excepcion) {
            throw new IllegalStateException("No se pudo leer " + ARCHIVO_PROPIEDADES, excepcion);
        }
        sobrescribirConVariableEntorno(propiedades, "db.url", "PASANTIX_DB_URL");
        sobrescribirConVariableEntorno(propiedades, "db.driver", "PASANTIX_DB_DRIVER");
        sobrescribirConVariableEntorno(propiedades, "db.usuario", "PASANTIX_DB_USUARIO");
        sobrescribirConVariableEntorno(propiedades, "db.contrasena", "PASANTIX_DB_CONTRASENA");
        return propiedades;
    }

    private static void sobrescribirConVariableEntorno(Properties propiedades, String clave, String variable) {
        String valor = System.getenv(variable);
        if (valor != null && !valor.isBlank()) {
            propiedades.setProperty(clave, valor);
        }
    }

    /**
     * Abre una nueva conexión. Quien la recibe debe cerrarla
     * (se recomienda usar try-with-resources).
     *
     * @return conexión abierta a MySQL
     * @throws SQLException si no es posible conectarse
     */
    public static Connection obtenerConexion() throws SQLException {
        try {
            // Registro explícito del driver (necesario dentro de servidores web)
            Class.forName(PROPIEDADES.getProperty("db.driver"));
        } catch (ClassNotFoundException excepcion) {
            throw new SQLException("No se encontró el driver JDBC: " + PROPIEDADES.getProperty("db.driver"), excepcion);
        }
        return DriverManager.getConnection(
                PROPIEDADES.getProperty("db.url"),
                PROPIEDADES.getProperty("db.usuario"),
                PROPIEDADES.getProperty("db.contrasena", ""));
    }
}
