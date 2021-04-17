const dbValidator = require('../helpers/db-validadores');
const verificacionGoogle = require('../helpers/google-verificacion');
const ValidarJWT = require('../helpers/jwt');
const uploaded = require('../helpers/up-file');

//con los 3 puntos exportamos todo lo que haya en cadauno de los archivos
module.exports = {
    ...ValidarJWT,
    ...dbValidator,
    ...verificacionGoogle,
    ...uploaded
}