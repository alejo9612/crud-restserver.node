const { Schema, model } = require('mongoose');
const categoria = require('./categoria');

const productoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        uniqued: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: { ///se crea el schema que va a llamar e tipo objeto id con la referencua de usuario
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
            //esto es requerido para poder utilizarlo, ya que la referenca debe de ser igual a como esta en el model de usuario sintacticamente, para poder utilizar sus propiedades.
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    }
});

productoSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject();
    return data
}

module.exports = model('Producto', productoSchema);