const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { roleValido, emailExiste, emailUsuarioPorId } = require('../helpers/db-validadores');

const {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
} = require('../controllers/usuarios');

const router = Router();

//como ya configuramos en el servere el nombre de la ruta que definimos, lo que se hará es que se manejará solo con el '/' sin nada más 
router.get('/', usuariosGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    //check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']), //es isin = esta en (solo esos atibutos)
    check('rol').custom(roleValido), //llamamos la funció que creamos de validar 
    validarCampos //esta es la función de middlewares que nos validará los campos luego de llenarlos y ates de hacer el post y almacenarlos
], usuariosPost);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(emailUsuarioPorId),
    check('rol').custom(roleValido),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(emailUsuarioPorId),
    validarCampos
], usuariosDelete);

module.exports = router;