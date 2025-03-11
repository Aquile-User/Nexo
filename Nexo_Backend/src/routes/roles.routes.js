const express = require('express');
const router = express.Router();

const rolController = require('../controllers/roles.controllers');


// Rutas para roles
router.get('/:id?', rolController.obtenerRol); // Agregamos un parámetro opcional ':id?'
router.post('/', rolController.crearRol);   // POST /roles
router