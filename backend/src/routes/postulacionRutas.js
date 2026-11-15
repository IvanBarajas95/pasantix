/**
 * Archivo   : postulacionRutas.js
 * Propósito : Rutas de postulaciones (todas requieren token).
 */
const { Router } = require('express');
const manejadorAsync = require('../utils/manejadorAsync');
const { verificarToken, permitirRoles } = require('../middlewares/autenticacion');
const controlador = require('../controllers/postulacionControlador');

const router = Router();

router.use(verificarToken);
router.get('/', manejadorAsync(controlador.listarPostulaciones));
router.get('/:id', manejadorAsync(controlador.obtenerPostulacion));
router.post('/', permitirRoles('APRENDIZ'), manejadorAsync(controlador.crearPostulacion));
router.patch('/:id/estado', permitirRoles('EMPRESA', 'ADMIN'), manejadorAsync(controlador.cambiarEstado));
router.delete('/:id', manejadorAsync(controlador.eliminarPostulacion));

module.exports = router;
