const { response, request } = require("express");
const role = require("../models/role");


const adminRol = (req = request, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se requiere verificar el role sin validar el token pimero'
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede llevar a cabo está gestión`
        });
    }

    next();
}

const tieneRole = (...roles) => { //con este argumento de los puntos me tomas los reoles en un array

    return (req = request, res = response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se requiere verificar el role sin validar el token pimero'
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(500).json({
                msg: `El servicio necesita validar uno de estos ROLES: ${roles}`
            });
        }

        next();
    }
}

module.exports = {
    adminRol,
    tieneRole
}