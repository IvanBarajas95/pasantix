/**
 * Archivo   : empresaRutas.js
 * Propósito : Rutas CRUD de empresas. Escribir requiere rol ADMIN.
 */
const { Router } = require('express');
const manejadorAsync = require('../utils/manejadorAsync');
const { verificarToken, permitirRoles } = require('../middlewares/autenticacion');
const controlador = require('../controllers/empresaControlador');

const router = Router();

router.get('/', manejadorAsync(controlador.listarEmpresas));
router.get('/:id', manejadorAsync(controlador.obtenerEmpresa));
router.post('/', verificarToken, permitirRoles('ADMIN'), manejadorAsync(controlador.crearEmpresa));
router.put('/:id', verificarToken, permitirRoles('ADMIN'), manejadorAsync(controlador.actualizarEmpresa));
router.delete('/:id', verificarToken, permitirRoles('ADMIN'), manejadorAsync(controlador.eliminarEmpresa));

module.exports = router;
