const mongoose = require('mongoose');

//creamos un función la cual me va a manejar la concexión con la base de datos, así mismo la exportamos y configuramos basandonos en la docummentación.
const dbConnection = async() => {

    try {

        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //estos 2 dats adicionales es para que me reconozca versiones anteriores
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('base de datos conectada');

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos');
    }
}

//se llama en el server de la carpeta models ya que manejamos todo en este archivo
module.exports = {
    dbConnection
}