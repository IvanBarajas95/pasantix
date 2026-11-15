/**
 * Archivo   : validaciones.js
 * Propósito : Funciones reutilizables para validar los datos que llegan
 *             en las peticiones (textos, correos, números, fechas, etc.).
 */

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PATRON_TELEFONO = /^[0-9]{7,10}$/;
const PATRON_NIT = /^[0-9]{9}-[0-9]$/;
const PATRON_FECHA = /^\d{4}-\d{2}-\d{2}$/;
// Solo letras (incluye tildes y ñ) y espacios
const PATRON_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/;

/** Verifica que un texto exista y tenga una longitud entre min y max. */
function esTextoValido(valor, minimo, maximo) {
  return typeof valor === 'string' && valor.trim().length >= minimo && valor.trim().length <= maximo;
}

function esCorreoValido(valor) {
  return typeof valor === 'string' && valor.length <= 120 && PATRON_CORREO.test(valor);
}

function esTelefonoValido(valor) {
  return valor === undefined || valor === null || valor === '' || PATRON_TELEFONO.test(String(valor));
}

function esNitValido(valor) {
  return typeof valor === 'string' && PATRON_NIT.test(valor);
}

function esNombreValido(valor, maximo = 80) {
  return esTextoValido(valor, 2, maximo) && PATRON_NOMBRE.test(valor);
}

/** Valida formato AAAA-MM-DD y que la fecha exista en el calendario. */
function esFechaValida(valor) {
  if (typeof valor !== 'string' || !PATRON_FECHA.test(valor)) return false;
  const fecha = new Date(`${valor}T00:00:00`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().startsWith(valor);
}

function esEnteroEnRango(valor, minimo, maximo) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero >= minimo && numero <= maximo;
}

/** Documento de identidad: solo números, de 6 a 10 dígitos. */
function esDocumentoValido(valor) {
  return /^[0-9]{6,10}$/.test(String(valor ?? ''));
}

/** La contraseña debe tener 8+ caracteres, una mayúscula, un número y un especial. */
function esContrasenaSegura(valor) {
  return typeof valor === 'string'
    && valor.length >= 8 && valor.length <= 64
    && /[A-Z]/.test(valor) && /[0-9]/.test(valor) && /[^A-Za-z0-9]/.test(valor);
}

module.exports = {
  esTextoValido,
  esCorreoValido,
  esTelefonoValido,
  esNitValido,
  esNombreValido,
  esFechaValida,
  esEnteroEnRango,
  esDocumentoValido,
  esContrasenaSegura
};
