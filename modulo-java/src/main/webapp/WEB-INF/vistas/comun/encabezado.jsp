<%-- Fragmento reutilizable: barra superior (se incluye con jsp:include) --%>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<header class="barra">
    <a class="marca" href="${pageContext.request.contextPath}/"><img src="${pageContext.request.contextPath}/img/logo-pasantix.png" alt="Pasantix - Conectando aprendices con oportunidades reales"></a>
    <nav>
        <a href="${pageContext.request.contextPath}/empresas">Empresas</a>
        <a href="${pageContext.request.contextPath}/empresas?accion=nuevo">Nueva empresa</a>
    </nav>
</header>
