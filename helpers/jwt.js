const jwt = require('jsonwebtoken');

//creamos la constante que me va almacenar la promesa de jwt ya que es necesario para pdoe utilizarlo

const generarJWT = (uid = '') => {
    //tomamos los datos que vamos a validar en este caso el atributo va hacer el uid=id que nos del el  usuario

    return new Promise((resolve, reject) => { //creamos la promesa

        const payload = { uid };

        //llamamos elmetodo sing que nos indica lo que vamos necesitando poner en los 2 primeros campos, luego abrimos el callback luego de las llaves
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => { //declaramos el callback

            if (err) { //indicamos el resultado de cada uno de los atributos del callback
                console.log(err);
                reject('No se pudo generar el Token');
            } else {
                resolve(token);
            }
        })

    });
}

module.exports = {
    generarJWT
}