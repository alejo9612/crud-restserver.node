const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verificacionGoogle = async(idToken = '') => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    //const payload = ticket.getPayload();
    //cambiamos el nombre de payload por como lo tengamso en el schema
    const {
        name: nombre,
        picture: img,
        email: correo
    } = ticket.getPayload(); //desestructuramos el paylod para traer lo que deseamos

    //const userid = payload['sub']; //me trae el UID de googel

    return { nombre, img, correo };
}

module.exports = {
    verificacionGoogle
}