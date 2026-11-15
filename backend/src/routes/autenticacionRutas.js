/**
 * Archivo   : autenticacionRutas.js
 * Propósito : Rutas de registro, inicio de sesión y perfil.
 */
const { Router } = require('express');
const manejadorAsync = require('../utils/manejadorAsync');
const { verificarToken } = require('../middlewares/autenticacion');
const controlador = require('../controllers/autenticacionControlador');

const router = Router();

router.post('/registro', manejadorAsync(controlador.registrarUsuario));
router.post('/login', manejadorAsync(controlador.iniciarSesion));
router.get('/perfil', verificarToken, manejadorAsync(controlador.obtenerPerfil));

module.exports = router;
