/**
 * Archivo   : ofertaRutas.js
 * Propósito : Rutas CRUD de ofertas. Consultar es público; crear, editar
 *             y eliminar requiere rol EMPRESA o ADMIN.
 */
const { Router } = require('express');
const manejadorAsync = require('../utils/manejadorAsync');
const { verificarToken, permitirRoles } = require('../middlewares/autenticacion');
const controlador = require('../controllers/ofertaControlador');

const router = Router();
const soloEmpresaOAdmin = [verificarToken, permitirRoles('EMPRESA', 'ADMIN')];

router.get('/', manejadorAsync(controlador.listarOfertas));
router.get('/:id', manejadorAsync(controlador.obtenerOferta));
router.post('/', soloEmpresaOAdmin, manejadorAsync(controlador.crearOferta));
router.put('/:id', soloEmpresaOAdmin, manejadorAsync(controlador.actualizarOferta));
router.delete('/:id', soloEmpresaOAdmin, manejadorAsync(controlador.eliminarOferta));

module.exports = router;
