const { validationResult } = require('express-validator'); //Se requiere del pakete de node

const validarCampos = (req, res, next) => {

    const errors = validationResult(req); //metodo propio de express-validator
    if (!errors.isEmpty()) {
        return res.status(400).json(errors); //regresa el check que creamos en la ruta
    }

    next(); //esta funnció n hace que sigamos 1 por 1 los middlewares
}

module.exports = {
    validarCampos
}