const express = require('express')
const router = express.Router()
const controller = require('../controllers/IncapacidadMedicaController')

router.get('/:id', controller.obtenerIncapacidadesPorPaciente)

router.post('/', controller.crearIncapacidadMedica)

router.put('/:idConsulta', controller.actualizarIncapacidadMedica)

router.delete('/:idIncapacidad', controller.eliminarIncapacidadMedica)

router.post('/enviar-correo/:id', controller.enviarIncapacidadPorCorreo)

router.post('/pdf/:idIncapacidad', controller.generarPdf);

module.exports = router 