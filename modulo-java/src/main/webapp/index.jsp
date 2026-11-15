<%--
    Vista     : index.jsp
    Propósito : Página de inicio del módulo Java de Pasantix.
    Autor     : Iván Antonio Ovalle Barajas
--%>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.time.LocalDate, java.time.format.DateTimeFormatter" %>
<%! // Declaración JSP: método disponible en toda la página
    private String fechaDeHoy() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pasantix | Módulo de empresas</title>
    <link rel="icon" type="image/png" href="${pageContext.request.contextPath}/img/favicon.png">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/estilos.css">
</head>
<body>
<jsp:include page="/WEB-INF/vistas/comun/encabezado.jsp" />
<main class="contenedor">
    <section class="tarjeta portada">
        <img src="img/logo-pasantix.png" alt="Pasantix">
        <h1>Módulo de gestión de <span class="acento">empresas</span></h1>
        <p>Registro y administración de las empresas que ofrecen pasantías a los aprendices que agotaron su contrato de aprendizaje.<br>Construido con <strong>Java, Servlets, JSP y JDBC</strong> sobre MySQL.</p>
        <p class="tenue">Hoy es <%= fechaDeHoy() %> · Proyecto formativo ADSO · Ficha 3336169</p>
        <div class="acciones">
            <a class="boton" href="empresas">Ver empresas</a>
            <a class="boton secundario" href="empresas?accion=nuevo">Registrar empresa</a>
        </div>
    </section>
</main>
</body>
</html>
