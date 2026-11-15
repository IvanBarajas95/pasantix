/**
 * Archivo   : aprendizControlador.js
 * Propósito : CRUD de aprendices con validación de datos.
 */
const AprendizModelo = require('../models/AprendizModelo');
const ErrorApi = require('../utils/ErrorApi');
const validar = require('../utils/validaciones');
const { obtenerIdValido } = require('./empresaControlador');

function validarAprendiz(cuerpo) {
  const errores = [];
  if (!validar.esNombreValido(cuerpo.nombres)) errores.push('Los nombres solo admiten letras (2 a 80 caracteres).');
  if (!validar.esNombreValido(cuerpo.apellidos)) errores.push('Los apellidos solo admiten letras (2 a 80 caracteres).');
  if (!validar.esDocumentoValido(cuerpo.documento)) errores.push('El documento debe tener entre 6 y 10 dígitos.');
  if (!validar.esCorreoValido(cuerpo.correo)) errores.push('El correo no tiene un formato válido.');
  if (!validar.esTelefonoValido(cuerpo.telefono)) errores.push('El teléfono debe tener entre 7 y 10 dígitos.');
  if (cuerpo.programa && !validar.esTextoValido(cuerpo.programa, 3, 120)) errores.push('El programa debe tener entre 3 y 120 caracteres.');
  if (cuerpo.ficha && !/^[0-9]{6,10}$/.test(String(cuerpo.ficha))) errores.push('La ficha debe tener entre 6 y 10 dígitos.');
  if (cuerpo.ciudad && !validar.esNombreValido(cuerpo.ciudad)) errores.push('La ciudad solo admite letras.');
  if (errores.length > 0) throw new ErrorApi(400, 'Datos de aprendiz inválidos.', errores);

  return {
    nombres: cuerpo.nombres.trim(),
    apellidos: cuerpo.apellidos.trim(),
    documento: String(cuerpo.documento),
    correo: cuerpo.correo.toLowerCase(),
    telefono: cuerpo.telefono || null,
    programa: cuerpo.programa || 'Análisis y Desarrollo de Software',
    ficha: cuerpo.ficha ? String(cuerpo.ficha) : null,
    ciudad: cuerpo.ciudad ? cuerpo.ciudad.trim() : 'Bogotá'
  };
}

async function listarAprendices(req, res) {
  const aprendices = await AprendizModelo.listar();
  res.json({ exito: true, total: aprendices.length, datos: aprendices });
}

async function obtenerAprendiz(req, res) {
  const aprendiz = await AprendizModelo.buscarPorId(obtenerIdValido(req.params.id));
  if (!aprendiz) throw new ErrorApi(404, 'Aprendiz no encontrado.');
  res.json({ exito: true, datos: aprendiz });
}

async function crearAprendiz(req, res) {
  const aprendiz = validarAprendiz(req.body);
  const idAprendiz = await AprendizModelo.crear(aprendiz);
  res.status(201).json({ exito: true, mensaje: 'Aprendiz creado correctamente.', datos: { id_aprendiz: idAprendiz, ...aprendiz } });
}

async function actualizarAprendiz(req, res) {
  const idAprendiz = obtenerIdValido(req.params.id);
  const aprendiz = validarAprendiz(req.body);
  const filasAfectadas = await AprendizModelo.actualizar(idAprendiz, aprendiz);
  if (filasAfectadas === 0) throw new ErrorApi(404, 'Aprendiz no encontrado.');
  res.json({ exito: true, mensaje: 'Aprendiz actualizado correctamente.', datos: { id_aprendiz: idAprendiz, ...aprendiz } });
}

async function eliminarAprendiz(req, res) {
  const filasAfectadas = await AprendizModelo.eliminar(obtenerIdValido(req.params.id));
  if (filasAfectadas === 0) throw new ErrorApi(404, 'Aprendiz no encontrado.');
  res.json({ exito: true, mensaje: 'Aprendiz eliminado correctamente.' });
}

module.exports = { listarAprendices, obtenerAprendiz, crearAprendiz, actualizarAprendiz, eliminarAprendiz };
