/**
 * Archivo   : autenticacion.js
 * Propósito : Middlewares para proteger rutas con JSON Web Token (JWT)
 *             y para permitir el acceso solo a ciertos roles.
 */
const jwt = require('jsonwebtoken');
const ErrorApi = require('../utils/ErrorApi');

/** Verifica que la petición traiga el encabezado: Authorization: Bearer <token> */
function verificarToken(req, res, next) {
  const encabezado = req.headers.authorization || '';
  const [tipo, token] = encabezado.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return next(new ErrorApi(401, 'Debe iniciar sesión: falta el token de acceso.'));
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRETO);
    return next();
  } catch (error) {
    return next(new ErrorApi(401, 'El token no es válido o ya expiró.'));
  }
}

/** Permite el paso solo si el rol del usuario está en la lista recibida. */
function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return next(new ErrorApi(403, 'No tiene permisos para realizar esta acción.'));
    }
    return next();
  };
}

module.exports = { verificarToken, permitirRoles };
