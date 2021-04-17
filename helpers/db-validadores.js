const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');

const roleValido = async(rol = '') => {
    const exiteRol = await Role.findOne({ rol }); //buscamos un rol igual al que validamos
    if (!exiteRol) {
        //es un error personalizado para validar de express-validator se debe de hacer con throw
        throw new Error(`El rol ${rol} no se encuentra registrado en nuestra base de datos`);
    }
}

const emailExiste = async(correo = '') => { //validamos por correo para ver si ya existe o no
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El email ${correo} ya esta registrado, por favor verificar un correo diferente`);
    }
}

const emailUsuarioPorId = async(id) => { //validamos por id si existe continua, de lo contrario emite error
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`);
    }
}

const existeCategoriaPorID = async(id) => {

    const existeCategoria = await Categoria.findById(id);

    if (!existeCategoria) {
        throw new Error(`El id no existe ${id}`)
    }
}
const existeProductoPorID = async(id) => {

    const existeProducto = await Producto.findById(id);

    if (!existeProducto) {
        throw new Error(`El id no existe ${id}`);
    }
}

//validacion de colecciones

const coleccionPermitida = (coleccion = '', colecciones = []) => {

    const incluidas = colecciones.includes(coleccion);
    if (!incluidas) {
        throw new Error(`La colección ${coleccion} no es permitida, validar las siguientes ${colecciones}`);
    }
    return true; //retorna true para corroborar que todo este bien
}

module.exports = {
    roleValido,
    emailExiste,
    emailUsuarioPorId,
    existeCategoriaPorID,
    existeProductoPorID,
    coleccionPermitida
}