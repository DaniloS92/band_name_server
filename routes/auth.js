// path: api/login

const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario } = require('../controllers/auth');

const router = Router();

router.post('/new', [
    check('nombre', 'El nombre es obligatorio papu').not().isEmpty(),
] ,crearUsuario);

module.exports = router