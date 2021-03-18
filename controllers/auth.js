const { response } = require("express");
const bcriptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

const Usuario = require('../models/usuario');

const Login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
        //Validar Email
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        //Si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        //Verificar la contraseña
        const validarPassword = bcriptjs.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
        //Generar JWT
        const token = await generarJWT(usuario.id); //Lamamos la función asiganda en una variable 

        ///
        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'ERROR - Hable con el administrador'
        });
    }

}

module.exports = {
    Login
}