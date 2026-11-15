/**
 * Archivo   : aprendizRutas.js
 * Propósito : Rutas CRUD de aprendices (datos personales: requieren token).
 */
const { Router } = require('express');
const manejadorAsync = require('../utils/manejadorAsync');
const { verificarToken, permitirRoles } = require('../middlewares/autenticacion');
const controlador = require('../controllers/aprendizControlador');

const router = Router();

router.use(verificarToken);
router.get('/', permitirRoles('ADMIN', 'EMPRESA'), manejadorAsync(controlador.listarAprendices));
router.get('/:id', manejadorAsync(controlador.obtenerAprendiz));
router.post('/', permitirRoles('ADMIN'), manejadorAsync(controlador.crearAprendiz));
router.put('/:id', permitirRoles('ADMIN'), manejadorAsync(controlador.actualizarAprendiz));
router.delete('/:id', permitirRoles('ADMIN'), manejadorAsync(controlador.eliminarAprendiz));

module.exports = router;
