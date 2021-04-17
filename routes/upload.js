const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarArchivo, mostrarImg, actualizarArchivoCloudinary } = require('../controllers/upload');
const { coleccionPermitida } = require('../helpers');
const { validarCampos, validarArchivosUp } = require('../middlewares');

const router = Router();

router.post('/', validarArchivosUp, cargarArchivo);

//se actualizan los archivos mediante la ruta
router.put('/:coleccion/:id', [
    validarArchivosUp,
    check('id', 'El id debe de ser un id de mongoDB válido').isMongoId(),
    check('coleccion').custom(c => coleccionPermitida(c, ['usuarios', 'productos'])), //coleccion y array permitido
    validarCampos
], actualizarArchivoCloudinary);
//], actualizarArchivo);

router.get('/:coleccion/:id', [
    check('id', 'El id debe de ser un id de mongoDB válido').isMongoId(),
    check('coleccion').custom(c => coleccionPermitida(c, ['usuarios', 'productos'])), //coleccion y array permitido
    validarCampos
], mostrarImg);

module.exports = router;