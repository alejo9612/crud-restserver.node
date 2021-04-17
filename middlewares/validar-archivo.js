const { response } = require("express")


const validarArchivosUp = (req, res = response, next) => {

    //Validar las extensiones
    //const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif']; //creamos la condición de file que necesitamos
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'No hay archivos que subir - validarArchivo'
        });
    }
    next();
}

module.exports = {
    validarArchivosUp
}