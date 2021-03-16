// path: api/login

const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new', [
    check('nombre', 'El nombre es obligatorio papu').not().isEmpty(),
    check('password', 'El pass es obligatorio papu').not().isEmpty(),
    check('email', 'El correo es obligatorio papu').isEmail(),
    validarCampos,
] ,crearUsuario);

router.post('/', [
    check('password', 'El pass es obligatorio papu').not().isEmpty(),
    check('email', 'El correo es obligatorio papu').isEmail(),
], loginUsuario);

router.get('/renew', validarJWT, renewToken);

module.exports = router