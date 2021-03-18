const { response, request } = require('express'); // se hace las destructuración para poder utilizar las opciones que nos ofrece expres
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario'); //con la U en mayuscula para crear instancias

//response =  todo el metodo de las respuestas, como json, send, redirect, etc
//request = todo lo que se requiere como el body o el query que sería los datos que están en la URL todo el link con sus caracteres

const usuariosGet = async(req = request, res = response) => {

    //en caso de que no este el nombre de la pagina le colocamos por default no name, al igual en la pagina si no se indica se coloca por default 1
    //const { q, nombre = 'no name', apikey, page = 1, limit } = req.query;

    const { limite = 5, desde = 0 } = req.query; /// desestructuramos el query y damos valor por default
    const query = { estado: true }; // variable de filtro del etado para que me muetre solo los datos que estac activos

    /*const usuarios = await Usuario.find(query) creamos la variable de usuarios que me traera toda la información de los usuarios.
        .skip(Number(desde))
        .limit(Number(limite));
    const total = await Usuario.countDocuments(query); esta es la nueva forma de hacer el count
    */

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query) // creamos la variable de usuarios que me traera toda la información de los usuarios.
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.send({
        total,
        usuarios
    });
}
const usuariosPost = async(req, res = response) => {

    const { nombre, correo, password, rol } = req.body; //AQUI VIENE LO QUE SOLICITA EL USUARIO EN EL REQ(SIEMPRE)
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); //se crea la constante y llamamos el metodo desde la constate que creamos con el valor que queramos del tamaño de encriptación
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar DB
    await usuario.save();

    res.json({
        usuario
    });
}
const usuariosPut = async(req, res = response) => {

    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body; //desestructuramos el body con lo que desemos

    ///Validar con la base de datos
    if (password) {
        const salt = bcryptjs.genSaltSync(); //se crea la constante y llamamos el metodo desde la constate que creamos con el valor que queramos del tamaño de encriptación
        resto.password = bcryptjs.hashSync(password, salt);
    }
    //lo que hace es que me busca por el id y si es el mismo me permite valdar de lo contrario no
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}
const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    //borrado fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);
    //esta es la eliminación para que aparezca en el fronen eliminado pero pueda tener una referencia en mi BD por el lado del backend
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json(usuario);

}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}