/**
 * Archivo   : usuarioModelo.js
 * Propósito : Consultas SQL de la tabla "usuarios" (capa Modelo).
 */
const { obtenerPool } = require('./db');

async function buscarPorUsuario(usuario) {
  const [filas] = await obtenerPool().query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
  return filas[0] || null;
}

async function crearUsuario(usuario, contrasenaHash) {
  const [resultado] = await obtenerPool().query(
    'INSERT INTO usuarios (usuario, contrasena_hash) VALUES (?, ?)',
    [usuario, contrasenaHash]
  );
  return resultado.insertId;
}

/** Lista los usuarios SIN la contraseña (nunca se debe exponer). */
async function listarUsuarios() {
  const [filas] = await obtenerPool().query('SELECT id_usuario, usuario, fecha_registro FROM usuarios');
  return filas;
}

module.exports = { buscarPorUsuario, crearUsuario, listarUsuarios };
