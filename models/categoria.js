const { Schema, model } = require('mongoose');
const { Categoria } = require('.');

const categoriaSchema = Schema({
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
    }
});

categoriaSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject();
    return data
}

module.exports = model('Categoria', categoriaSchema);