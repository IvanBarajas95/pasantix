/**
 * Archivo   : manejadorAsync.js
 * Propósito : Envolver controladores asíncronos para que cualquier error
 *             llegue al middleware de manejo de errores (Express 4).
 */
function manejadorAsync(controlador) {
  return (req, res, next) => Promise.resolve(controlador(req, res, next)).catch(next);
}

module.exports = manejadorAsync;
