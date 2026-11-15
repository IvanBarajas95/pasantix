package co.edu.sena.pasantix.controlador;

import co.edu.sena.pasantix.dao.EmpresaDAO;
import co.edu.sena.pasantix.dao.EmpresaDAOImpl;
import co.edu.sena.pasantix.modelo.Empresa;
import co.edu.sena.pasantix.util.ValidadorEmpresa;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

/**
 * Controlador (Servlet) del módulo de empresas.
 * <ul>
 *   <li>GET  /empresas                 → listar (y buscar con ?buscar=texto)</li>
 *   <li>GET  /empresas?accion=nuevo    → formulario vacío</li>
 *   <li>GET  /empresas?accion=editar&amp;id=1 → formulario con datos</li>
 *   <li>POST /empresas accion=guardar  → insertar o actualizar</li>
 *   <li>POST /empresas accion=eliminar → eliminar</li>
 * </ul>
 *
 * @author Iván Antonio Ovalle Barajas
 * @version 1.0
 */
@WebServlet(name = "EmpresaServlet", urlPatterns = {"/empresas"})
public class EmpresaServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final String VISTA_LISTA = "/WEB-INF/vistas/empresas/lista.jsp";
    private static final String VISTA_FORMULARIO = "/WEB-INF/vistas/empresas/formulario.jsp";

    private final transient EmpresaDAO empresaDao = new EmpresaDAOImpl();

    /** Atiende las peticiones GET (consultas y formularios). */
    @Override
    protected void doGet(HttpServletRequest peticion, HttpServletResponse respuesta)
            throws ServletException, IOException {
        peticion.setCharacterEncoding("UTF-8");
        String accion = valorOVacio(peticion.getParameter("accion"));
        try {
            switch (accion) {
                case "nuevo" -> mostrarFormulario(peticion, respuesta, new Empresa());
                case "editar" -> mostrarFormularioEdicion(peticion, respuesta);
                default -> listar(peticion, respuesta);
            }
        } catch (SQLException excepcion) {
            throw new ServletException("Error al consultar la base de datos", excepcion);
        }
    }

    /** Atiende las peticiones POST (guardar y eliminar). */
    @Override
    protected void doPost(HttpServletRequest peticion, HttpServletResponse respuesta)
            throws ServletException, IOException {
        peticion.setCharacterEncoding("UTF-8");
        String accion = valorOVacio(peticion.getParameter("accion"));
        try {
            if ("eliminar".equals(accion)) {
                eliminar(peticion, respuesta);
            } else {
                guardar(peticion, respuesta);
            }
        } catch (SQLException excepcion) {
            throw new ServletException("Error al guardar en la base de datos", excepcion);
        }
    }

    private void listar(HttpServletRequest peticion, HttpServletResponse respuesta)
            throws SQLException, ServletException, IOException {
        String textoBuscado = valorOVacio(peticion.getParameter("buscar")).trim();
        List<Empresa> empresas = textoBuscado.isEmpty()
                ? empresaDao.listarTodas()
                : empresaDao.buscarPorTexto(textoBuscado);
        peticion.setAttribute("empresas", empresas);
        peticion.setAttribute("buscar", textoBuscado);
        peticion.getRequestDispatcher(VISTA_LISTA).forward(peticion, respuesta);
    }

    private void mostrarFormularioEdicion(HttpServletRequest peticion, HttpServletResponse respuesta)
            throws SQLException, ServletException, IOException {
        Optional<Empresa> empresa = empresaDao.buscarPorId(convertirId(peticion.getParameter("id")));
        if (empresa.isEmpty()) {
            redirigirConMensaje(peticion, respuesta, "La empresa no existe.");
            return;
        }
        mostrarFormulario(peticion, respuesta, empresa.get());
    }

    private void mostrarFormulario(HttpServletRequest peticion, HttpServletResponse respuesta, Empresa empresa)
            throws ServletException, IOException {
        peticion.setAttribute("empresa", empresa);
        peticion.getRequestDispatcher(VISTA_FORMULARIO).forward(peticion, respuesta);
    }

    private void guardar(HttpServletRequest peticion, HttpServletResponse respuesta)
            throws SQLException, ServletException, IOException {
        Empresa empresa = new Empresa(
                valorOVacio(peticion.getParameter("nit")).trim(),
                valorOVacio(peticion.getParameter("razonSocial")).trim(),
                ValidadorEmpresa.limpiar(peticion.getParameter("sector")),
                valorOVacio(peticion.getParameter("correo")).trim().toLowerCase(),
                ValidadorEmpresa.limpiar(peticion.getParameter("telefono")),
                valorOVacio(peticion.getParameter("ciudad")).trim());
        empresa.setIdEmpresa(convertirId(peticion.getParameter("idEmpresa")));

        List<String> errores = ValidadorEmpresa.validar(empresa);
        if (!errores.isEmpty()) {
            peticion.setAttribute("errores", errores);
            mostrarFormulario(peticion, respuesta, empresa);
            return;
        }

        try {
            if (empresa.getIdEmpresa() > 0) {
                empresaDao.actualizar(empresa);
                redirigirConMensaje(peticion, respuesta, "Empresa actualizada correctamente.");
            } else {
                empresaDao.insertar(empresa);
                redirigirConMensaje(peticion, respuesta, "Empresa registrada correctamente.");
            }
        } catch (SQLException excepcion) {
            // Código 1062 = registro duplicado (NIT repetido)
            if (excepcion.getErrorCode() == 1062) {
                peticion.setAttribute("errores", List.of("Ya existe una empresa con el NIT " + empresa.getNit() + "."));
                mostrarFormulario(peticion, respuesta, empresa);
                return;
            }
            throw excepcion;
        }
    }

    private void eliminar(HttpServletRequest peticion, HttpServletResponse respuesta)
            throws SQLException, IOException {
        boolean eliminada = empresaDao.eliminar(convertirId(peticion.getParameter("idEmpresa")));
        redirigirConMensaje(peticion, respuesta, eliminada ? "Empresa eliminada correctamente." : "La empresa no existe.");
    }

    /** Patrón PRG (Post-Redirect-Get): guarda el mensaje en sesión y redirige. */
    private void redirigirConMensaje(HttpServletRequest peticion, HttpServletResponse respuesta, String mensaje)
            throws IOException {
        peticion.getSession().setAttribute("mensaje", mensaje);
        respuesta.sendRedirect(peticion.getContextPath() + "/empresas");
    }

    private static int convertirId(String valor) {
        try {
            return Integer.parseInt(valorOVacio(valor).trim());
        } catch (NumberFormatException excepcion) {
            return 0;
        }
    }

    private static String valorOVacio(String valor) {
        return valor == null ? "" : valor;
    }
}
