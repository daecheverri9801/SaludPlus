const express = require('express')
const router = express.Router()
const controller = require('../controllers/historialController')

router.get('/:id', controller.obtenerHistorial)

router.get('/:idPaciente/:idHistorial', controller.obtenerHistorialId)

router.post('/', controller.crearHistorial)

router.put('/:idConsulta', controller.actualizarHistorial)

router.delete('/:idConsulta', controller.eliminarConsulta)

module.exports = router