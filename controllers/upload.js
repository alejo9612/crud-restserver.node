const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL); //Llamamos la autetificación de cloudinary

const { response } = require("express");
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');



const cargarArchivo = async(req, res = response) => {

    try {
        //Imagenes
        //const nombre = await subirArchivo(req.files, ['txt','md','textos']);
        const nombre = await subirArchivo(req.files, undefined, 'imgs'); //por default me trae las imagenes que configuramos y toma la ruta de la carpeta uploads para almacenar los datos

        //Crea carpeta a fuerza del archivo que guardamos por default

    } catch (error) {
        res.status(400).json({ msg });
    }

    //    res.json({ nombre });

}

//funisión para actualizar los archivos que se suben 
const actualizarArchivo = async(req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No exite el usuario con el id ${id}`
                });;
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No exite el producto con el id ${id}`
                });;
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Se me olvido subir colección'
            });
            break;
    }
    //Limpiar archivo  imagenes previas
    if (modelo.img) { //realizamos la busqueda del archivo
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen); //eliminamos el archivo que encuentre
        }
    }
    //declaramos el archivo que se va a guardar con su coleccion de manera discriminada, en este caso usuarios o productos
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
}

//funisión para los archivos que utilizaremos en la plataforma de cloudinary
const actualizarArchivoCloudinary = async(req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No exite el usuario con el id ${id}`
                });;
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No exite el producto con el id ${id}`
                });;
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Se me olvido subir colección'
            });
            break;
    }
    //Limpiar archivo  imagenes previas
    if (modelo.img) {
        //carpinteria para discriminar el nombre del archivo separado por /
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1]; // tomamos el ultimo atributo del array que tenemos
        const [public_id] = nombre.split('.'); //sparamos por.
        cloudinary.uploader.destroy(public_id); //el public_id es la identificación por default decloudinary
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo);
}

const mostrarImg = async(req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No exite el usuario con el id ${id}`
                });;
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No exite el producto con el id ${id}`
                });;
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Se me olvido subir colección'
            });
            break;
    }
    //Obtener la img de producto
    if (modelo.img) { //realizamos la busqueda del archivo
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }
    //img de error por falta de img de producto
    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagen);


}

module.exports = {
    cargarArchivo,
    actualizarArchivo,
    actualizarArchivoCloudinary,
    mostrarImg
}