const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => { //hacemos la función async ya que la necesitamos llamar

    const token = req.header('x-token'); // creamos la variable que solicita valor del header

    if (!token) { //hacemos la condición con su respuesta en status y msg
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try { // capturamos las fallas con la verificación del jwt en una constante de desestructuración

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid); //creamos la constante que me indentifique el uid de quien se loga
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existete en DB'
            });
        }

        //Verificación del estado del usuario logueado
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            });
        }

        req.usuario = usuario;

        next();


    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }
}

module.exports = {
    validarJWT
}