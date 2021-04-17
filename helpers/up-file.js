const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {
        const { archivo } = files; //Desestructuramosel nombre del archivo que vamos a manejar
        const nombreCortado = archivo.name.split('.'); //metodo de identificador de archivo por texto en este caso el .
        const extension = nombreCortado[nombreCortado.length - 1];

        //Validar las extensiones
        //const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif']; //creamos la condición de file que necesitamos
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es valida, por favor intente con las siguientes ${extensionesValidas}`)
                //return res.status(400).json({
                // })
        }

        ///

        const nombreTemporal = uuidv4() + '.' + extension; //declaramos la variable de nombre con ayuda de la contatenacción de uuid y la extención
        uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
                //return res.status(500).json({ err });
            }

            resolve(nombreTemporal);
            //res.json({
            //   msg: 'File uploaded to ' + uploadPath
            //});
        });
    });
}

module.exports = {
    subirArchivo
}