const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { Login } = require('../controllers/auth');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es oligatorio').isEmail(),
    check('password', 'El password es necesario').not().isEmpty(),
    validarCampos
], Login);

module.exports = router;