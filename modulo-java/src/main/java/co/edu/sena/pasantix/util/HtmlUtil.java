package co.edu.sena.pasantix.util;

/**
 * Utilidad para escapar texto antes de mostrarlo en HTML (evita XSS).
 *
 * @author Iván Antonio Ovalle Barajas
 * @version 1.0
 */
public final class HtmlUtil {

    private HtmlUtil() {
    }

    /** Reemplaza los caracteres especiales de HTML; null se muestra vacío. */
    public static String escapar(String texto) {
        if (texto == null) {
            return "";
        }
        return texto.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
