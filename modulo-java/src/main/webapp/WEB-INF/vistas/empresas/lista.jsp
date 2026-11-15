<%--
    Vista     : lista.jsp
    Propósito : Mostrar las empresas, buscarlas (GET) y eliminarlas (POST).
    Autor     : Iván Antonio Ovalle Barajas
--%>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.List, co.edu.sena.pasantix.modelo.Empresa, co.edu.sena.pasantix.util.HtmlUtil" %>
<%
    // Scriptlet: se leen los datos que envió el Servlet
    @SuppressWarnings("unchecked")
    List<Empresa> empresas = (List<Empresa>) request.getAttribute("empresas");
    String buscar = (String) request.getAttribute("buscar");
    String mensaje = (String) session.getAttribute("mensaje");
    session.removeAttribute("mensaje"); // El mensaje se muestra una sola vez
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pasantix | Empresas</title>
    <link rel="icon" type="image/png" href="${pageContext.request.contextPath}/img/favicon.png">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/estilos.css">
</head>
<body>
<jsp:include page="/WEB-INF/vistas/comun/encabezado.jsp" />
<main class="contenedor">
    <h1>Empresas registradas</h1>

    <% if (mensaje != null) { %>
        <p class="alerta exito"><%= HtmlUtil.escapar(mensaje) %></p>
    <% } %>

    <!-- Formulario con método GET: los datos viajan en la URL (?buscar=...) -->
    <form class="busqueda" method="get" action="empresas">
        <label for="buscar">Buscar por NIT o razón social</label>
        <input id="buscar" name="buscar" type="search" maxlength="60" value="<%= HtmlUtil.escapar(buscar) %>">
        <button class="boton" type="submit">Buscar</button>
        <a class="boton secundario" href="empresas">Limpiar</a>
    </form>

    <% if (empresas == null || empresas.isEmpty()) { %>
        <p class="tarjeta">No se encontraron empresas.</p>
    <% } else { %>
    <div class="tabla-desplazable">
    <table>
        <thead>
        <tr><th>ID</th><th>NIT</th><th>Razón social</th><th>Sector</th><th>Correo</th><th>Teléfono</th><th>Ciudad</th><th>Acciones</th></tr>
        </thead>
        <tbody>
        <% for (Empresa empresa : empresas) { %>
        <tr>
            <td><%= empresa.getIdEmpresa() %></td>
            <td><%= HtmlUtil.escapar(empresa.getNit()) %></td>
            <td><%= HtmlUtil.escapar(empresa.getRazonSocial()) %></td>
            <td><%= HtmlUtil.escapar(empresa.getSector()) %></td>
            <td><%= HtmlUtil.escapar(empresa.getCorreo()) %></td>
            <td><%= HtmlUtil.escapar(empresa.getTelefono()) %></td>
            <td><%= HtmlUtil.escapar(empresa.getCiudad()) %></td>
            <td class="acciones-fila">
                <a class="boton pequeno" href="empresas?accion=editar&amp;id=<%= empresa.getIdEmpresa() %>">Editar</a>
                <!-- Formulario con método POST para eliminar -->
                <form method="post" action="empresas"
                      onsubmit="return confirm('¿Eliminar la empresa <%= HtmlUtil.escapar(empresa.getRazonSocial()) %>?');">
                    <input type="hidden" name="accion" value="eliminar">
                    <input type="hidden" name="idEmpresa" value="<%= empresa.getIdEmpresa() %>">
                    <button class="boton pequeno peligro" type="submit">Eliminar</button>
                </form>
            </td>
        </tr>
        <% } %>
        </tbody>
    </table>
    </div>
    <p class="tenue">Total: <%= empresas.size() %> empresa(s).</p>
    <% } %>
</main>
</body>
</html>
