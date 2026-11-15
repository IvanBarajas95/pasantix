/**
 * Archivo   : postulacionControlador.js
 * Propósito : Gestionar las postulaciones de los aprendices a las ofertas.
 */
const PostulacionModelo = require('../models/PostulacionModelo');
const OfertaModelo = require('../models/OfertaModelo');
const ErrorApi = require('../utils/ErrorApi');
const validar = require('../utils/validaciones');
const { obtenerIdValido } = require('./empresaControlador');

const ESTADOS = ['PENDIENTE', 'ACEPTADA', 'RECHAZADA'];

/** Cada rol ve solo lo que le corresponde. */
async function listarPostulaciones(req, res) {
  const filtros = { idOferta: req.query.oferta };
  if (req.usuario.rol === 'APRENDIZ') filtros.idAprendiz = req.usuario.id_perfil;
  if (req.usuario.rol === 'EMPRESA') filtros.idEmpresa = req.usuario.id_perfil;

  const postulaciones = await PostulacionModelo.listar(filtros);
  res.json({ exito: true, total: postulaciones.length, datos: postulaciones });
}

async function obtenerPostulacion(req, res) {
  const postulacion = await PostulacionModelo.buscarPorId(obtenerIdValido(req.params.id));
  if (!postulacion) throw new ErrorApi(404, 'Postulación no encontrada.');
  res.json({ exito: true, datos: postulacion });
}

/** POST /api/postulaciones  (solo APRENDIZ) */
async function crearPostulacion(req, res) {
  const idOferta = obtenerIdValido(req.body.id_oferta);
  const { comentario } = req.body;
  if (comentario && !validar.esTextoValido(comentario, 1, 255)) {
    throw new ErrorApi(400, 'El comentario no puede superar 255 caracteres.');
  }

  const oferta = await OfertaModelo.buscarPorId(idOferta);
  if (!oferta) throw new ErrorApi(404, 'La oferta no existe.');
  if (oferta.estado !== 'ABIERTA') throw new ErrorApi(400, 'La oferta está cerrada y no recibe postulaciones.');

  const idPostulacion = await PostulacionModelo.crear({
    id_oferta: idOferta, id_aprendiz: req.usuario.id_perfil, comentario
  });
  res.status(201).json({ exito: true, mensaje: 'Postulación registrada correctamente.', datos: { id_postulacion: idPostulacion } });
}

/** PATCH /api/postulaciones/:id/estado  (EMPRESA o ADMIN) */
async function cambiarEstado(req, res) {
  const idPostulacion = obtenerIdValido(req.params.id);
  const { estado, comentario } = req.body;
  if (!ESTADOS.includes(estado)) throw new ErrorApi(400, 'El estado debe ser PENDIENTE, ACEPTADA o RECHAZADA.');

  const postulacion = await PostulacionModelo.buscarPorId(idPostulacion);
  if (!postulacion) throw new ErrorApi(404, 'Postulación no encontrada.');
  if (req.usuario.rol === 'EMPRESA') {
    const oferta = await OfertaModelo.buscarPorId(postulacion.id_oferta);
    if (oferta.id_empresa !== req.usuario.id_perfil) throw new ErrorApi(403, 'La postulación no pertenece a sus ofertas.');
  }

  await PostulacionModelo.actualizarEstado(idPostulacion, estado, comentario);
  res.json({ exito: true, mensaje: `Postulación marcada como ${estado}.` });
}

async function eliminarPostulacion(req, res) {
  const idPostulacion = obtenerIdValido(req.params.id);
  const postulacion = await PostulacionModelo.buscarPorId(idPostulacion);
  if (!postulacion) throw new ErrorApi(404, 'Postulación no encontrada.');
  if (req.usuario.rol === 'APRENDIZ' && postulacion.id_aprendiz !== req.usuario.id_perfil) {
    throw new ErrorApi(403, 'Solo puede retirar sus propias postulaciones.');
  }
  await PostulacionModelo.eliminar(idPostulacion);
  res.json({ exito: true, mensaje: 'Postulación eliminada correctamente.' });
}

module.exports = { listarPostulaciones, obtenerPostulacion, crearPostulacion, cambiarEstado, eliminarPostulacion };
