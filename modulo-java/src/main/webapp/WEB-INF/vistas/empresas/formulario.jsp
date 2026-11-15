<%--
    Vista     : formulario.jsp
    Propósito : Formulario HTML (método POST) para registrar o editar una empresa.
    Autor     : Iván Antonio Ovalle Barajas
--%>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.List, co.edu.sena.pasantix.modelo.Empresa, co.edu.sena.pasantix.util.HtmlUtil" %>
<%
    Empresa empresa = (Empresa) request.getAttribute("empresa");
    @SuppressWarnings("unchecked")
    List<String> errores = (List<String>) request.getAttribute("errores");
    boolean esEdicion = empresa != null && empresa.getIdEmpresa() > 0;
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pasantix | <%= esEdicion ? "Editar" : "Registrar" %> empresa</title>
    <link rel="icon" type="image/png" href="${pageContext.request.contextPath}/img/favicon.png">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/estilos.css">
</head>
<body>
<jsp:include page="/WEB-INF/vistas/comun/encabezado.jsp" />
<main class="contenedor">
    <h1><%= esEdicion ? "Editar empresa #" + empresa.getIdEmpresa() : "Registrar empresa" %></h1>

    <% if (errores != null && !errores.isEmpty()) { %>
    <div class="alerta error">
        <strong>Revise los siguientes datos:</strong>
        <ul><% for (String error : errores) { %><li><%= HtmlUtil.escapar(error) %></li><% } %></ul>
    </div>
    <% } %>

    <form class="tarjeta formulario" method="post" action="empresas" novalidate>
        <input type="hidden" name="accion" value="guardar">
        <input type="hidden" name="idEmpresa" value="<%= esEdicion ? empresa.getIdEmpresa() : 0 %>">

        <label for="nit">NIT *</label>
        <input id="nit" name="nit" required pattern="[0-9]{9}-[0-9]" placeholder="900123456-1"
               value="<%= HtmlUtil.escapar(empresa.getNit()) %>">

        <label for="razonSocial">Razón social *</label>
        <input id="razonSocial" name="razonSocial" required minlength="3" maxlength="150"
               value="<%= HtmlUtil.escapar(empresa.getRazonSocial()) %>">

        <label for="sector">Sector</label>
        <input id="sector" name="sector" maxlength="80" value="<%= HtmlUtil.escapar(empresa.getSector()) %>">

        <label for="correo">Correo *</label>
        <input id="correo" name="correo" type="email" required maxlength="120"
               value="<%= HtmlUtil.escapar(empresa.getCorreo()) %>">

        <label for="telefono">Teléfono</label>
        <input id="telefono" name="telefono" inputmode="numeric" pattern="[0-9]{7,10}"
               value="<%= HtmlUtil.escapar(empresa.getTelefono()) %>">

        <label for="ciudad">Ciudad *</label>
        <input id="ciudad" name="ciudad" required maxlength="80"
               value="<%= HtmlUtil.escapar(empresa.getCiudad() == null ? "Bogotá" : empresa.getCiudad()) %>">

        <div class="acciones">
            <button class="boton" type="submit"><%= esEdicion ? "Guardar cambios" : "Registrar" %></button>
            <a class="boton secundario" href="empresas">Cancelar</a>
        </div>
    </form>
</main>
</body>
</html>
