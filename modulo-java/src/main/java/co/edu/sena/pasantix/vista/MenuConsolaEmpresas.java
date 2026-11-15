package co.edu.sena.pasantix.vista;

import co.edu.sena.pasantix.dao.EmpresaDAO;
import co.edu.sena.pasantix.dao.EmpresaDAOImpl;
import co.edu.sena.pasantix.modelo.Empresa;
import co.edu.sena.pasantix.util.ValidadorEmpresa;
import java.io.Console;
import java.nio.charset.Charset;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;

/**
 * Aplicación stand-alone (consola) que prueba el CRUD de empresas con JDBC:
 * inserción, consulta, actualización y eliminación.
 * Ejecutar con: mvn compile exec:java
 *
 * @author Iván Antonio Ovalle Barajas
 * @version 1.0
 */
public class MenuConsolaEmpresas {

    private final EmpresaDAO empresaDao = new EmpresaDAOImpl();
    private final Scanner lector = new Scanner(System.in, obtenerCodificacionConsola());

    public static void main(String[] args) {
        new MenuConsolaEmpresas().iniciar();
    }

    /** Usa la codificación de la consola (en Windows respeta las tildes). */
    private static Charset obtenerCodificacionConsola() {
        Console consola = System.console();
        return consola != null ? consola.charset() : Charset.defaultCharset();
    }

    /** Muestra el menú hasta que el usuario elija la opción 0. */
    public void iniciar() {
        int opcion;
        do {
            mostrarMenu();
            opcion = leerEntero("Seleccione una opción: ");
            try {
                switch (opcion) {
                    case 1 -> listarEmpresas();
                    case 2 -> consultarEmpresa();
                    case 3 -> insertarEmpresa();
                    case 4 -> actualizarEmpresa();
                    case 5 -> eliminarEmpresa();
                    case 0 -> System.out.println("¡Hasta pronto!");
                    default -> System.out.println("[!] Opción no válida.");
                }
            } catch (SQLException excepcion) {
                System.out.println("[ERROR] Error de base de datos: " + excepcion.getMessage());
            }
        } while (opcion != 0);
    }

    private void mostrarMenu() {
        System.out.println();
        System.out.println("===== PASANTIX - GESTIÓN DE EMPRESAS (JDBC) =====");
        System.out.println("1. Listar empresas (consulta)");
        System.out.println("2. Buscar empresa por id (consulta)");
        System.out.println("3. Registrar empresa (inserción)");
        System.out.println("4. Actualizar empresa (actualización)");
        System.out.println("5. Eliminar empresa (eliminación)");
        System.out.println("0. Salir");
    }

    private void listarEmpresas() throws SQLException {
        List<Empresa> empresas = empresaDao.listarTodas();
        System.out.printf("%-4s %-13s %-32s %-14s %-26s %-11s %s%n",
                "ID", "NIT", "RAZÓN SOCIAL", "SECTOR", "CORREO", "TELÉFONO", "CIUDAD");
        empresas.forEach(System.out::println);
        System.out.println("Total: " + empresas.size() + " empresa(s).");
    }

    private void consultarEmpresa() throws SQLException {
        int idEmpresa = leerEntero("Id de la empresa: ");
        Optional<Empresa> empresa = empresaDao.buscarPorId(idEmpresa);
        System.out.println(empresa.map(Empresa::toString).orElse("[!] No existe una empresa con id " + idEmpresa));
    }

    private void insertarEmpresa() throws SQLException {
        Empresa empresa = leerDatosEmpresa(null);
        if (esValida(empresa)) {
            int idNuevo = empresaDao.insertar(empresa);
            System.out.println("[OK] Empresa registrada con id " + idNuevo);
        }
    }

    private void actualizarEmpresa() throws SQLException {
        int idEmpresa = leerEntero("Id de la empresa a actualizar: ");
        Optional<Empresa> existente = empresaDao.buscarPorId(idEmpresa);
        if (existente.isEmpty()) {
            System.out.println("[!] No existe una empresa con id " + idEmpresa);
            return;
        }
        System.out.println("Datos actuales: " + existente.get());
        Empresa empresa = leerDatosEmpresa(existente.get());
        empresa.setIdEmpresa(idEmpresa);
        if (esValida(empresa) && empresaDao.actualizar(empresa)) {
            System.out.println("[OK] Empresa actualizada.");
        }
    }

    private void eliminarEmpresa() throws SQLException {
        int idEmpresa = leerEntero("Id de la empresa a eliminar: ");
        System.out.print("¿Seguro? Se eliminarán también sus ofertas (S/N): ");
        if (!lector.nextLine().trim().equalsIgnoreCase("S")) {
            System.out.println("Operación cancelada.");
            return;
        }
        System.out.println(empresaDao.eliminar(idEmpresa)
                ? "[OK] Empresa eliminada."
                : "[!] No existe una empresa con id " + idEmpresa);
    }

    /**
     * Pide los datos de la empresa. Si se recibe una empresa actual,
     * presionar Enter conserva el valor anterior.
     */
    private Empresa leerDatosEmpresa(Empresa actual) {
        Empresa empresa = new Empresa();
        empresa.setNit(leerTexto("NIT (900123456-1)", actual == null ? null : actual.getNit()));
        empresa.setRazonSocial(leerTexto("Razón social", actual == null ? null : actual.getRazonSocial()));
        empresa.setSector(ValidadorEmpresa.limpiar(leerTexto("Sector", actual == null ? null : actual.getSector())));
        empresa.setCorreo(leerTexto("Correo", actual == null ? null : actual.getCorreo()));
        empresa.setTelefono(ValidadorEmpresa.limpiar(leerTexto("Teléfono", actual == null ? null : actual.getTelefono())));
        empresa.setCiudad(leerTexto("Ciudad", actual == null ? "Bogotá" : actual.getCiudad()));
        return empresa;
    }

    private boolean esValida(Empresa empresa) {
        List<String> errores = ValidadorEmpresa.validar(empresa);
        errores.forEach(error -> System.out.println("[!] " + error));
        return errores.isEmpty();
    }

    private String leerTexto(String etiqueta, String valorActual) {
        System.out.print(etiqueta + (valorActual != null ? " [" + valorActual + "]" : "") + ": ");
        String texto = lector.hasNextLine() ? lector.nextLine().trim() : "";
        return texto.isEmpty() ? valorActual : texto;
    }

    private int leerEntero(String mensaje) {
        while (true) {
            System.out.print(mensaje);
            if (!lector.hasNextLine()) {
                return 0;
            }
            String texto = lector.nextLine().trim();
            try {
                return Integer.parseInt(texto);
            } catch (NumberFormatException excepcion) {
                System.out.println("[!] Debe escribir un número entero.");
            }
        }
    }
}
