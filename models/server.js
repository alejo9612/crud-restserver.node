//REQUERIMIENTOS
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config'); //destructuramomos el contenido y tomamos loq ue necesitamos de la funcio para la conexión con la base de datos

//Inicialización de la clase
class Server {

    constructor() { // me llama mis metoddos de manera global, es resto se llamadan desde app con el server.
        this.app = express();
        this.port = process.env.PORT;

        //nombre de las rutas
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        //concexion a la base de datos de MongoDB
        this.conectarDB();

        //middlewares
        this.middlewares();

        //Rutas de mi app
        this.routes();
    }

    async conectarDB() { //cremos un metodo async para que nos enlace con la base de datos
        await dbConnection();
    }

    middlewares() { //son funciones dentro de mi clase
        //Cors
        this.app.use(cors()); //función de npm para habilitar accesos en la app de parte del backend
        //lectura y parseo del body
        this.app.use(express.json()); // me trae la información que enviamos en formato json
        //Directorio publico
        this.app.use(express.static('public')); //ruta para la carpeta publica al inicialziar la app
    }

    routes() { //rutas alternativas de la app con sus metodos, las configuramos como si fuese un middleware, donde indicamos el nombre que manejaremos en la ruta y de donde la requerimos

        this.app.use(this.authPath, require('../routes/auth')); //login
        this.app.use(this.usuariosPath, require('../routes/usuarios')); //usuarios
    }

    listen() { //express el localhost se llama de aqui
        this.app.listen(this.port, () => {
            console.log('Escuchando a través del pureto', this.port);
        });
    }
}

module.exports = Server;