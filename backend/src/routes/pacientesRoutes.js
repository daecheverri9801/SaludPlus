const express = require('express')
const router = express.Router()
const controller = require('../controllers/pacienteController')

router.get('/', controller.listarPacientes)
router.get('/:id', controller.obtenerPacientePorId)
router.post('/', controller.crearPaciente)
router.put('/:id', controller.actualizarPaciente)
router.delete('/:id', controller.eliminarPaciente)

module.exports = router