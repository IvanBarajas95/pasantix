/**
 * Archivo   : ErrorApi.js
 * Propósito : Clase de error personalizada que guarda el código HTTP
 *             y la lista de detalles de validación.
 */
class ErrorApi extends Error {
  constructor(codigoHttp, mensaje, detalles = []) {
    super(mensaje);
    this.codigoHttp = codigoHttp;
    this.detalles = detalles;
  }
}

module.exports = ErrorApi;
