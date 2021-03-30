const { Router } = require('express');
const { check } = require('express-validator');
const {
    obtenerProducto,
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productos');
const { existeCategoriaPorID, existeProductoPorID } = require('../helpers/db-validadores');

const { validarJWT, validarCampos, tieneRole, adminRol } = require('../middlewares');

const router = Router();

//Obtener todas las categorías - public
router.get('/', obtenerProductos);

//Obtener la categoría por id - public
router.get('/:id', [
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorID),
    validarCampos,
], obtenerProducto);

//Crear categoría - privado - cualquier pesona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio Parcero').not().isEmpty(),
    check('categoria', 'No es un id de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorID),
    validarCampos,
], crearProducto);

//Actualizar - privado - cualquier pesona con un token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorID),
    validarCampos,
], actualizarProducto);

//Elimiar categoría - privado - ADMIN
router.delete('/:id', [
    validarJWT,
    adminRol,
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorID),
    validarCampos
], eliminarProducto);


module.exports = router;