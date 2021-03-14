const { Schema, model } = require('mongoose');

//se crea la constante que me va indicar los campos que debo de llenar en la base de datos, con su respectivo tipo de campo, etc. mediante el Schema
const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

//de esta manera controlamos la seguridad de nuestros usuarios con respecto a sus contraseñas, ya que al creal la siguiente función lo que mostraremos son solo los datos que necesitamos que se vean, capturando los datos que queremosocultar
usuarioSchema.methods.toJSON = function() { //llamamos del json la funcion
    const { __v, password, ...usuario } = this.toObject(); //con el this desestructuramos el objeto con los datos que no queremos que se vea
    return usuario;
}


//exportamos el modelo que va ser el nombre del campo que se va a ingresar(la tabla) en la base de datos, el segundo argumento del model será la función que cremos para tomar los los datos que se llenan con su type
module.exports = model('Usuario', usuarioSchema); //se coloca en singular ya que al crearla quedará en plural