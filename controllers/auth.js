const { response } = require("express");
const bcriptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

const Usuario = require('../models/usuario');
const { verificacionGoogle } = require("../helpers/google-verificacion");

//creamos la función async para el login con las validaciones correspondientes

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

//creamos una nueva constante que nos confirme el inicio de cesión de google
const googleSingin = async(req, res = response) => {

    const { id_token } = req.body; //requerimos el id que se iserta en el body

    try {
        // recibimos como argumento el id_token del body ya que lo desestructuramos  como argumento de la función

        const { nombre, correo, img } = await verificacionGoogle(id_token);
        //desestructuramos los datos que necesitamos

        let usuario = await Usuario.findOne({ correo }); // declaramos la función desestructuramos el Usuario siemore y cuando lo encuentre para hacer match


        //tengo que crearlo creacón del usuariario
        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':)',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //si el usuario en la DB esta en false se niega la autorización
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador - Usuario bloqueado'
            })
        }

        //Generar JWT
        const token = await generarJWT(usuario.id); //llamamos al usuario como lo necesitamos
        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Token de google no válido'
        })
    }
}

module.exports = {
    Login,
    googleSingin
}