/**
 * Archivo   : ofertaControlador.js
 * Propósito : CRUD de ofertas de pasantía. Las empresas solo pueden
 *             modificar sus propias ofertas; el ADMIN puede todas.
 */
const OfertaModelo = require('../models/OfertaModelo');
const ErrorApi = require('../utils/ErrorApi');
const validar = require('../utils/validaciones');
const { obtenerIdValido } = require('./empresaControlador');

const MODALIDADES = ['PRESENCIAL', 'REMOTA', 'HIBRIDA'];
const ESTADOS = ['ABIERTA', 'CERRADA'];

function validarOferta(cuerpo) {
  const errores = [];
  if (!validar.esTextoValido(cuerpo.titulo, 5, 120)) errores.push('El título debe tener entre 5 y 120 caracteres.');
  if (!validar.esTextoValido(cuerpo.descripcion, 10, 2000)) errores.push('La descripción debe tener entre 10 y 2000 caracteres.');
  if (!validar.esTextoValido(cuerpo.area, 3, 80)) errores.push('El área debe tener entre 3 y 80 caracteres.');
  if (!MODALIDADES.includes(cuerpo.modalidad)) errores.push('La modalidad debe ser PRESENCIAL, REMOTA o HIBRIDA.');
  if (!validar.esEnteroEnRango(cuerpo.cupos, 1, 50)) errores.push('Los cupos deben ser un número entero entre 1 y 50.');
  if (!validar.esFechaValida(cuerpo.fecha_publicacion)) errores.push('La fecha de publicación debe tener el formato AAAA-MM-DD.');
  if (!validar.esFechaValida(cuerpo.fecha_cierre)) errores.push('La fecha de cierre debe tener el formato AAAA-MM-DD.');
  if (validar.esFechaValida(cuerpo.fecha_publicacion) && validar.esFechaValida(cuerpo.fecha_cierre)
      && cuerpo.fecha_cierre < cuerpo.fecha_publicacion) {
    errores.push('La fecha de cierre no puede ser anterior a la fecha de publicación.');
  }
  const estado = cuerpo.estado || 'ABIERTA';
  if (!ESTADOS.includes(estado)) errores.push('El estado debe ser ABIERTA o CERRADA.');
  if (errores.length > 0) throw new ErrorApi(400, 'Datos de oferta inválidos.', errores);

  return {
    titulo: cuerpo.titulo.trim(),
    descripcion: cuerpo.descripcion.trim(),
    area: cuerpo.area.trim(),
    modalidad: cuerpo.modalidad,
    cupos: Number(cuerpo.cupos),
    fecha_publicacion: cuerpo.fecha_publicacion,
    fecha_cierre: cuerpo.fecha_cierre,
    estado
  };
}

/** Lanza 403 si una EMPRESA intenta modificar una oferta que no es suya. */
function verificarPropietario(usuario, oferta) {
  if (usuario.rol === 'EMPRESA' && oferta.id_empresa !== usuario.id_perfil) {
    throw new ErrorApi(403, 'Solo puede modificar las ofertas de su empresa.');
  }
}

async function listarOfertas(req, res) {
  const { estado, modalidad, empresa, buscar } = req.query;
  const ofertas = await OfertaModelo.listar({ estado, modalidad, idEmpresa: empresa, buscar });
  res.json({ exito: true, total: ofertas.length, datos: ofertas });
}

async function obtenerOferta(req, res) {
  const oferta = await OfertaModelo.buscarPorId(obtenerIdValido(req.params.id));
  if (!oferta) throw new ErrorApi(404, 'Oferta no encontrada.');
  res.json({ exito: true, datos: oferta });
}

async function crearOferta(req, res) {
  const oferta = validarOferta(req.body);
  // La empresa se toma del token; el ADMIN debe indicarla en el cuerpo.
  oferta.id_empresa = req.usuario.rol === 'EMPRESA' ? req.usuario.id_perfil : Number(req.body.id_empresa);
  if (!validar.esEnteroEnRango(oferta.id_empresa, 1, 2147483647)) {
    throw new ErrorApi(400, 'Debe indicar un id_empresa válido.');
  }
  const idOferta = await OfertaModelo.crear(oferta);
  res.status(201).json({ exito: true, mensaje: 'Oferta creada correctamente.', datos: { id_oferta: idOferta, ...oferta } });
}

async function actualizarOferta(req, res) {
  const idOferta = obtenerIdValido(req.params.id);
  const ofertaActual = await OfertaModelo.buscarPorId(idOferta);
  if (!ofertaActual) throw new ErrorApi(404, 'Oferta no encontrada.');
  verificarPropietario(req.usuario, ofertaActual);

  const oferta = validarOferta(req.body);
  await OfertaModelo.actualizar(idOferta, oferta);
  res.json({ exito: true, mensaje: 'Oferta actualizada correctamente.', datos: { id_oferta: idOferta, ...oferta } });
}

async function eliminarOferta(req, res) {
  const idOferta = obtenerIdValido(req.params.id);
  const ofertaActual = await OfertaModelo.buscarPorId(idOferta);
  if (!ofertaActual) throw new ErrorApi(404, 'Oferta no encontrada.');
  verificarPropietario(req.usuario, ofertaActual);

  await OfertaModelo.eliminar(idOferta);
  res.json({ exito: true, mensaje: 'Oferta eliminada correctamente.' });
}

module.exports = { listarOfertas, obtenerOferta, crearOferta, actualizarOferta, eliminarOferta };
