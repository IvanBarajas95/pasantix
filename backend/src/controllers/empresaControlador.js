/**
 * Archivo   : empresaControlador.js
 * Propósito : Recibir las peticiones HTTP de empresas, validar y responder.
 */
const EmpresaModelo = require('../models/EmpresaModelo');
const ErrorApi = require('../utils/ErrorApi');
const validar = require('../utils/validaciones');

/** Valida los campos de una empresa y devuelve el objeto limpio. */
function validarEmpresa(cuerpo) {
  const errores = [];
  if (!validar.esNitValido(cuerpo.nit)) errores.push('El NIT debe tener el formato 900123456-1.');
  if (!validar.esTextoValido(cuerpo.razon_social, 3, 150)) errores.push('La razón social debe tener entre 3 y 150 caracteres.');
  if (cuerpo.sector && !validar.esTextoValido(cuerpo.sector, 3, 80)) errores.push('El sector debe tener entre 3 y 80 caracteres.');
  if (!validar.esCorreoValido(cuerpo.correo)) errores.push('El correo no tiene un formato válido.');
  if (!validar.esTelefonoValido(cuerpo.telefono)) errores.push('El teléfono debe tener entre 7 y 10 dígitos.');
  if (cuerpo.ciudad && !validar.esNombreValido(cuerpo.ciudad)) errores.push('La ciudad solo admite letras.');
  if (errores.length > 0) throw new ErrorApi(400, 'Datos de empresa inválidos.', errores);

  return {
    nit: cuerpo.nit,
    razon_social: cuerpo.razon_social.trim(),
    sector: cuerpo.sector || null,
    correo: cuerpo.correo.toLowerCase(),
    telefono: cuerpo.telefono || null,
    ciudad: cuerpo.ciudad || 'Bogotá'
  };
}

function obtenerIdValido(valor) {
  if (!validar.esEnteroEnRango(valor, 1, 2147483647)) throw new ErrorApi(400, 'El id debe ser un número entero positivo.');
  return Number(valor);
}

async function listarEmpresas(req, res) {
  const empresas = await EmpresaModelo.listar();
  res.json({ exito: true, total: empresas.length, datos: empresas });
}

async function obtenerEmpresa(req, res) {
  const empresa = await EmpresaModelo.buscarPorId(obtenerIdValido(req.params.id));
  if (!empresa) throw new ErrorApi(404, 'Empresa no encontrada.');
  res.json({ exito: true, datos: empresa });
}

async function crearEmpresa(req, res) {
  const empresa = validarEmpresa(req.body);
  const idEmpresa = await EmpresaModelo.crear(empresa);
  res.status(201).json({ exito: true, mensaje: 'Empresa creada correctamente.', datos: { id_empresa: idEmpresa, ...empresa } });
}

async function actualizarEmpresa(req, res) {
  const idEmpresa = obtenerIdValido(req.params.id);
  const empresa = validarEmpresa(req.body);
  const filasAfectadas = await EmpresaModelo.actualizar(idEmpresa, empresa);
  if (filasAfectadas === 0) throw new ErrorApi(404, 'Empresa no encontrada.');
  res.json({ exito: true, mensaje: 'Empresa actualizada correctamente.', datos: { id_empresa: idEmpresa, ...empresa } });
}

async function eliminarEmpresa(req, res) {
  const filasAfectadas = await EmpresaModelo.eliminar(obtenerIdValido(req.params.id));
  if (filasAfectadas === 0) throw new ErrorApi(404, 'Empresa no encontrada.');
  res.json({ exito: true, mensaje: 'Empresa eliminada correctamente.' });
}

module.exports = { listarEmpresas, obtenerEmpresa, crearEmpresa, actualizarEmpresa, eliminarEmpresa, obtenerIdValido };
