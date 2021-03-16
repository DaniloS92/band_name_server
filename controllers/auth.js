
const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJwt } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if(existeEmail) return res.status(400).json({ok: false, msg: 'Ya existe un correo en el sistema'});

        const usuario = new Usuario(req.body);

        // Encriptar pass
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generarJwt(usuario.id);
    
        res.json({
            ok: true,
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el papu',
        })
    }
}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuarioDB = await Usuario.findOne({email})
        if(!usuarioDB) return res.status(404).json({ok: false, msg: "Emial no encontrado"});

        // Validar el pass
        const validPass = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPass) return res.status(404).json({ok: false, msg: "Pass no valido"});

        // Generar el JWT
        const token = await generarJwt(usuarioDB.id);

        res.json({
            ok: true,
            usuarioDB,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el papu',
        })
    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;
    const token = await generarJwt(uid);
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    })
};

module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken,
}