const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { Login, googleSingin } = require('../controllers/auth');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es oligatorio').isEmail(),
    check('password', 'El password es necesario').not().isEmpty(),
    validarCampos
], Login);

router.post('/google', [ //esta es la validación de google
    check('id_token', 'El id token es necesario para poder acceder').not().isEmpty(),
    validarCampos
], googleSingin);

module.exports = router;