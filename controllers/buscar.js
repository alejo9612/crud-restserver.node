const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

//creamo la coleccion que manejaremos para poder llevar a cabo la busqueda que necesitamos
const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
];

const buscarUsuarios = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // validamos si es un id de ongo valido, en caso de ser correcto nos trae un TRUE o de lo contraio FALSE

    if (esMongoID) {
        const usuario = await Usuario.findById(termino); //hacer referencia  al id
        return res.json({ //hacermos una condición con el arternario
            results: (usuario) ? [usuario] : []
        });
    }

    //creamos una expresión regulada que reemplace el termino sin tener en cuenta mayusculas o minisculas
    const regex = new RegExp(termino, 'i');

    //creamos una constante que me tome mi modelo de usuarios, el cual me hará una condición propia de mongoDB la cual me treara la busqueda que necesitamos solo con ingresar algunas letras
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    return res.json({
        results: usuarios
    });
}
const buscarCategorias = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // validamos si es un id de ongo valido, en caso de ser correcto nos trae un TRUE o de lo contraio FALSE

    if (esMongoID) {
        const categoria = await Categoria.findById(termino); //hacer referencia  al id
        return res.json({ //hacermos una condición con el arternario
            results: (categoria) ? [categoria] : []
        });
    }

    //creamos una expresión regulada que reemplace el termino sin tener en cuenta mayusculas o minisculas
    const regex = new RegExp(termino, 'i');

    //creamos una constante que me tome mi modelo de usuarios, el cual me hará una condición propia de mongoDB la cual me treara la busqueda que necesitamos solo con ingresar algunas letras
    const categorias = await Categoria.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    });

    return res.json({
        results: categorias
    });

}

const buscarProductos = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre');

        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({ nombre: regex, estado: true })
        .populate('categoria', 'nombre');

    return res.json({
        results: productos
    });
}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) { //creamos la condición donde incluya el listado que necesitamos
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;

        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer está búsqueda'
            });
    }

}

module.exports = {
    buscar
}