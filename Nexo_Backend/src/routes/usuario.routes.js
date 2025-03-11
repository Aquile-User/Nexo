const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controllers');
// Rutas para usuarios
router.get('/', usuarioController.obtenerUsuarios);  // GET /usuarios
router.post('/', usuarioController.crearUsuario);   // POST /usuarios
router.put('/:id', usuarioController.actualizarUsuario); // PUT /usuarios/:id
router.delete('/:id', usuarioController.eliminarUsuario); // DELETE /usuarios/:id

module.exports = router;
