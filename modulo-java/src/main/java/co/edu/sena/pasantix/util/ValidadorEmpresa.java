package co.edu.sena.pasantix.util;

import co.edu.sena.pasantix.modelo.Empresa;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Reglas de validación de los datos de una empresa.
 * Se usa tanto en el menú de consola como en el Servlet.
 *
 * @author Iván Antonio Ovalle Barajas
 * @version 1.0
 */
public final class ValidadorEmpresa {

    private static final Pattern PATRON_NIT = Pattern.compile("^[0-9]{9}-[0-9]$");
    private static final Pattern PATRON_CORREO = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$");
    private static final Pattern PATRON_TELEFONO = Pattern.compile("^[0-9]{7,10}$");
    private static final Pattern PATRON_CIUDAD = Pattern.compile("^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,80}$");

    private ValidadorEmpresa() {
    }

    /**
     * Valida una empresa.
     *
     * @param empresa datos a validar
     * @return lista de mensajes de error (vacía si todo está bien)
     */
    public static List<String> validar(Empresa empresa) {
        List<String> errores = new ArrayList<>();
        if (empresa.getNit() == null || !PATRON_NIT.matcher(empresa.getNit()).matches()) {
            errores.add("El NIT debe tener el formato 900123456-1.");
        }
        if (!tieneLongitud(empresa.getRazonSocial(), 3, 150)) {
            errores.add("La razón social debe tener entre 3 y 150 caracteres.");
        }
        if (!esVacio(empresa.getSector()) && !tieneLongitud(empresa.getSector(), 3, 80)) {
            errores.add("El sector debe tener entre 3 y 80 caracteres.");
        }
        if (empresa.getCorreo() == null || !PATRON_CORREO.matcher(empresa.getCorreo()).matches()) {
            errores.add("El correo no tiene un formato válido.");
        }
        if (!esVacio(empresa.getTelefono()) && !PATRON_TELEFONO.matcher(empresa.getTelefono()).matches()) {
            errores.add("El teléfono debe tener entre 7 y 10 dígitos.");
        }
        if (empresa.getCiudad() == null || !PATRON_CIUDAD.matcher(empresa.getCiudad()).matches()) {
            errores.add("La ciudad solo admite letras (3 a 80 caracteres).");
        }
        return errores;
    }

    /** Convierte cadenas vacías en null para guardar NULL en la base de datos. */
    public static String limpiar(String valor) {
        return esVacio(valor) ? null : valor.trim();
    }

    private static boolean esVacio(String valor) {
        return valor == null || valor.isBlank();
    }

    private static boolean tieneLongitud(String valor, int minimo, int maximo) {
        return valor != null && valor.trim().length() >= minimo && valor.trim().length() <= maximo;
    }
}
