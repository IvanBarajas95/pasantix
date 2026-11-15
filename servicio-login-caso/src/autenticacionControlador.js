/**
 * Archivo   : autenticacionControlador.js
 * Propósito : Lógica del servicio web de registro e inicio de sesión.
 *  - Registro: guarda el usuario con la contraseña cifrada (bcrypt).
 *  - Login: si usuario y contraseña coinciden responde
 *           "Autenticación satisfactoria"; si no, "Error en la autenticación".
 */
const bcrypt = require('bcryptjs');
const modelo = require('./usuarioModelo');

const PATRON_USUARIO = /^[a-zA-Z0-9._]{4,30}$/;

/** Revisa que lleguen usuario y contraseña con el formato correcto. */
function validarCredenciales(usuario, contrasena) {
  const errores = [];
  if (typeof usuario !== 'string' || !PATRON_USUARIO.test(usuario)) {
    errores.push('El usuario debe tener de 4 a 30 caracteres: letras, números, punto o guion bajo.');
  }
  if (typeof contrasena !== 'string' || contrasena.length < 8 || contrasena.length > 64) {
    errores.push('La contraseña debe tener entre 8 y 64 caracteres.');
  }
  return errores;
}

/** POST /api/registro */
async function registrar(req, res, next) {
  try {
    const { usuario, contrasena } = req.body;
    const errores = validarCredenciales(usuario, contrasena);
    if (errores.length > 0) {
      return res.status(400).json({ exito: false, mensaje: 'Datos inválidos.', detalles: errores });
    }

    if (await modelo.buscarPorUsuario(usuario)) {
      return res.status(409).json({ exito: false, mensaje: `El usuario "${usuario}" ya existe.` });
    }

    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    const idUsuario = await modelo.crearUsuario(usuario, contrasenaHash);
    return res.status(201).json({
      exito: true,
      mensaje: 'Registro exitoso.',
      datos: { id_usuario: idUsuario, usuario }
    });
  } catch (error) {
    return next(error);
  }
}

/** POST /api/login */
async function iniciarSesion(req, res, next) {
  try {
    const { usuario, contrasena } = req.body;
    if (!usuario || !contrasena) {
      return res.status(400).json({ exito: false, mensaje: 'Debe enviar usuario y contraseña.' });
    }

    const registro = await modelo.buscarPorUsuario(usuario);
    const coincide = registro ? await bcrypt.compare(contrasena, registro.contrasena_hash) : false;

    if (!coincide) {
      return res.status(401).json({ exito: false, mensaje: 'Error en la autenticación.' });
    }
    return res.status(200).json({ exito: true, mensaje: 'Autenticación satisfactoria.', datos: { usuario } });
  } catch (error) {
    return next(error);
  }
}

/** GET /api/usuarios */
async function listar(req, res, next) {
  try {
    const usuarios = await modelo.listarUsuarios();
    return res.json({ exito: true, total: usuarios.length, datos: usuarios });
  } catch (error) {
    return next(error);
  }
}

module.exports = { registrar, iniciarSesion, listar };
