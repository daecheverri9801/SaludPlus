const express = require('express')
const router = express.Router()
const controller = require('../controllers/autorizacionMedicamentosController')

router.get('/:id', controller.obtenerAutorizacionMedicamento)

router.post('/', controller.crearAutorizacion)

router.put('/:idConsulta', controller.actualizarHistorial)

router.delete('/:idAutorizacion', controller.eliminarAutorizacionMedica)

router.post('/pdf/:idAutorizacion', controller.generarPdf);

module.exports = router