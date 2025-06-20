const express = require('express')
const router = express.Router()
const controller = require('../controllers/autorizacionProcedimientoExamenController')

router.get('/:id', controller.obtenerAutorizacionProcedimientoExamen)

router.post('/', controller.crearAutorizacionProcedimientoExamen)

router.put('/:idConsulta', controller.actualizarAutorizacionProcedimientoExamen)

router.delete('/:idAutorizacion', controller.eliminarAutorizacionProcedimientoExamenes)

router.post('/pdf/:idAutorizacion', controller.generarPdf);

module.exports = router