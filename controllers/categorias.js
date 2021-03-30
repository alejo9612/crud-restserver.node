const { response, request } = require("express");
const { Categoria } = require('../models');

//paginado - total - populate
const obtenerCategorias = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query; 
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.send({
        total,
        categorias
    });
}

//populate {}
const obtenerCategoria = async(req, res = response) => {

    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');

    res.json(categoria);
}

const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    //Comprobación de categorías creadas
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre}, ya exite parce`
        });
    }

    //Generar la data a guardar (Solo lo quequiero guardar)
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);
}

const actualizarCategoria = async(req = request, res = response) => {
    const id = req.params.id;

    const { estado, usuario, __v, ...data } = req.body;

    data.nombre =  data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json(categoria);
}

//estado
const eliminarCategoria = async(req = request, res = response) => {

    const { id } = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, {new: true}).populate('usuario','nombre');

    res.json(categoriaBorrada);

}

module.exports = {
    obtenerCategoria,
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}