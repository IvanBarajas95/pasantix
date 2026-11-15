/**
 * Archivo   : manejoErrores.js
 * Propósito : Centralizar las respuestas de error de la API para que
 *             siempre tengan el mismo formato JSON.
 */
const ErrorApi = require('../utils/ErrorApi');

/** Responde 404 cuando la ruta solicitada no existe. */
function rutaNoEncontrada(req, res, next) {
  next(new ErrorApi(404, `La ruta ${req.method} ${req.originalUrl} no existe.`));
}

// eslint-disable-next-line no-unused-vars
function manejarErrores(error, req, res, next) {
  // JSON mal escrito en el cuerpo de la petición
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ exito: false, mensaje: 'El cuerpo de la petición no es un JSON válido.' });
  }
  // Registro duplicado en MySQL (llave UNIQUE)
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ exito: false, mensaje: 'Ya existe un registro con esos datos (duplicado).' });
  }
  // Llave foránea que no existe
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ exito: false, mensaje: 'El registro relacionado no existe.' });
  }
  if (error instanceof ErrorApi) {
    const cuerpo = { exito: false, mensaje: error.message };
    if (error.detalles.length > 0) cuerpo.detalles = error.detalles;
    return res.status(error.codigoHttp).json(cuerpo);
  }

  console.error('Error no controlado:', error);
  return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
}

module.exports = { rutaNoEncontrada, manejarErrores };
