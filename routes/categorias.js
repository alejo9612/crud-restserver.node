const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerCategorias, obtenerCategoria, crearCategoria, eliminarCategoria, actualizarCategoria } = require('../controllers/categorias');
const { validarJWT, validarCampos, tieneRole, adminRol } = require('../middlewares');

const { roleValido, emailExiste, emailUsuarioPorId, existeCategoriaPorID } = require('../helpers/db-validadores');


const router = Router();

//Obtener todas las categorías - public
router.get('/', obtenerCategorias);

//Obtener la categoría por id - public
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorID),
    validarCampos
], obtenerCategoria);

//Crear categoría - privado - cualquier pesona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio Parce').not().isEmpty(),
    validarCampos,
], crearCategoria);

//Actualizar - privado - cualquier pesona con un token válido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es oligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorID),
    validarCampos
], actualizarCategoria);

//Elimiar categoría - privado - ADMIN
router.delete('/:id', [
    validarJWT,
    adminRol,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorID),
    validarCampos
], eliminarCategoria);


module.exports = router;