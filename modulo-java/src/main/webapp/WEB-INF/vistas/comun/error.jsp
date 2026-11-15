<%-- Página de error general (configurada en web.xml) --%>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Pasantix | Error</title>
    <link rel="icon" type="image/png" href="${pageContext.request.contextPath}/img/favicon.png">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/estilos.css">
</head>
<body>
<main class="contenedor">
    <div class="alerta error">
        <h1>Ocurrió un error</h1>
        <p>Revise que MySQL (XAMPP) esté encendido y que exista la base de datos <code>pasantix</code>.</p>
    </div>
    <a class="boton" href="${pageContext.request.contextPath}/">Volver al inicio</a>
</main>
</body>
</html>
