/**
 * Archivo   : autenticacionControlador.js
 * Propósito : Registro e inicio de sesión de usuarios (genera el JWT).
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModelo = require('../models/UsuarioModelo');
const AprendizModelo = require('../models/AprendizModelo');
const EmpresaModelo = require('../models/EmpresaModelo');
const ErrorApi = require('../utils/ErrorApi');
const validar = require('../utils/validaciones');

const ROLES_REGISTRO = ['APRENDIZ', 'EMPRESA'];

/** Valida los datos del registro según el rol y devuelve el perfil limpio. */
function validarRegistro(cuerpo) {
  const { correo, contrasena, rol = 'APRENDIZ' } = cuerpo;
  const errores = [];

  if (!ROLES_REGISTRO.includes(rol)) errores.push('El rol debe ser APRENDIZ o EMPRESA.');
  if (!validar.esCorreoValido(correo)) errores.push('El correo no tiene un formato válido.');
  if (!validar.esContrasenaSegura(contrasena)) {
    errores.push('La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial.');
  }
  if (cuerpo.ciudad !== undefined && !validar.esNombreValido(cuerpo.ciudad)) errores.push('La ciudad solo admite letras.');

  let perfil = {};
  let nombre = '';
  if (rol === 'APRENDIZ') {
    if (!validar.esNombreValido(cuerpo.nombres)) errores.push('El nombre solo admite letras (2 a 80 caracteres).');
    if (!validar.esNombreValido(cuerpo.apellidos)) errores.push('El apellido solo admite letras (2 a 80 caracteres).');
    if (!validar.esDocumentoValido(cuerpo.documento)) errores.push('El documento debe tener entre 6 y 10 dígitos.');
    if (!validar.esTextoValido(cuerpo.programa, 3, 120)) errores.push('El programa debe tener entre 3 y 120 caracteres.');
    if (errores.length === 0) {
      perfil = {
        nombres: cuerpo.nombres.trim(),
        apellidos: cuerpo.apellidos.trim(),
        documento: String(cuerpo.documento),
        programa: cuerpo.programa.trim(),
        ciudad: (cuerpo.ciudad || 'Bogotá').trim()
      };
      nombre = `${perfil.nombres} ${perfil.apellidos}`;
    }
  } else if (rol === 'EMPRESA') {
    if (!validar.esTextoValido(cuerpo.razon_social, 3, 150)) errores.push('La razón social debe tener entre 3 y 150 caracteres.');
    if (!validar.esNitValido(cuerpo.nit)) errores.push('El NIT debe tener el formato 900123456-1.');
    if (errores.length === 0) {
      perfil = { razon_social: cuerpo.razon_social.trim(), nit: cuerpo.nit, ciudad: (cuerpo.ciudad || 'Bogotá').trim() };
      nombre = perfil.razon_social;
    }
  }

  if (errores.length > 0) throw new ErrorApi(400, 'Datos de registro inválidos.', errores);
  return { nombre, correo: correo.toLowerCase(), rol, perfil };
}

/**
 * POST /api/auth/registro
 * Aprendiz: nombres, apellidos, documento, programa, ciudad, correo, contrasena
 * Empresa : razon_social, nit, ciudad, correo, contrasena
 */
async function registrarUsuario(req, res) {
  const datos = validarRegistro(req.body);

  const usuarioExistente = await UsuarioModelo.buscarPorCorreo(datos.correo);
  if (usuarioExistente) throw new ErrorApi(409, 'El correo ya está registrado.');

  const contrasenaHash = await bcrypt.hash(req.body.contrasena, 10);
  const idUsuario = await UsuarioModelo.crearConPerfil({ ...datos, contrasenaHash });

  res.status(201).json({
    exito: true,
    mensaje: 'Usuario registrado correctamente.',
    datos: { id_usuario: idUsuario, nombre: datos.nombre, correo: datos.correo, rol: datos.rol }
  });
}

/** POST /api/auth/login */
async function iniciarSesion(req, res) {
  const { correo, contrasena } = req.body;
  if (!validar.esCorreoValido(correo) || !validar.esTextoValido(contrasena, 1, 64)) {
    throw new ErrorApi(400, 'Debe enviar un correo válido y la contraseña.');
  }

  const usuario = await UsuarioModelo.buscarPorCorreo(correo.toLowerCase());
  const contrasenaCorrecta = usuario ? await bcrypt.compare(contrasena, usuario.contrasena_hash) : false;
  if (!contrasenaCorrecta) throw new ErrorApi(401, 'Error en la autenticación: correo o contraseña incorrectos.');

  const idPerfil = await UsuarioModelo.obtenerIdPerfil(usuario.id_usuario, usuario.rol);
  const token = jwt.sign(
    { id_usuario: usuario.id_usuario, rol: usuario.rol, id_perfil: idPerfil, nombre: usuario.nombre },
    process.env.JWT_SECRETO,
    { expiresIn: process.env.JWT_EXPIRA || '2h' }
  );

  res.json({
    exito: true,
    mensaje: 'Autenticación satisfactoria.',
    datos: {
      token,
      usuario: { id_usuario: usuario.id_usuario, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol, id_perfil: idPerfil }
    }
  });
}

/** GET /api/auth/perfil  (requiere token): usuario + datos de su perfil */
async function obtenerPerfil(req, res) {
  const usuario = await UsuarioModelo.buscarPorId(req.usuario.id_usuario);
  if (!usuario) throw new ErrorApi(404, 'Usuario no encontrado.');

  let perfil = null;
  if (usuario.rol === 'APRENDIZ' && req.usuario.id_perfil) perfil = await AprendizModelo.buscarPorId(req.usuario.id_perfil);
  if (usuario.rol === 'EMPRESA' && req.usuario.id_perfil) perfil = await EmpresaModelo.buscarPorId(req.usuario.id_perfil);

  res.json({ exito: true, datos: { ...usuario, id_perfil: req.usuario.id_perfil, perfil } });
}

module.exports = { registrarUsuario, iniciarSesion, obtenerPerfil };
