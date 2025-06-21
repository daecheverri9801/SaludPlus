const AutorizacionProcedimientoExamenFacade = require('../services/facade/autorizacionProcedimientoExamenFacade')
const ExportarPDFAutorizacionProcedimiento = require('../services/reportes/strategies/autorizacionProcedimientoExamen')
const fs = require('fs')
const ReporteAutorizacionProcedimiento = require('../services/reportes/tipos/reporteAutorizacionProcedimiento')
const ReporteService = require('../services/reportes/reporteService')

const generarPdf = async (req, res) => {
  const { idAutorizacion } = req.params

  try {
    const autorizacion = await AutorizacionProcedimientoExamenFacade.obtenerAutorizacionProcedimientoExamenesPorId(idAutorizacion)
    console.log(autorizacion)

    if (!autorizacion) {
      return res.status(404).json({ mensaje: 'No se encontró autorizacion para este ID.' })
    }

    const reporte = new ReporteAutorizacionProcedimiento(autorizacion[0])
    const estrategia = new ExportarPDFAutorizacionProcedimiento()

    const servicio = new ReporteService(reporte, estrategia)
    const filePath = await servicio.generar()

    res.download(filePath)
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al generar el PDF de incapacidad médica' })
  }
}


const obtenerAutorizacionProcedimientoExamen = async (req, res) => {
    const { id } = req.params

    try {
        const Autorizacion = await AutorizacionProcedimientoExamenFacade.obtenerAutorizacionProcedimientoExamenesPorPaciente(id)

        if (!Autorizacion || Autorizacion.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontró autorizacion Procedimiento/Examen para este paciente.' })
        }

        res.json(Autorizacion)

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener Autorizacion Procedimiento/Examen' })
    }
}

const crearAutorizacionProcedimientoExamen = async (req, res) => {
    const { id_paciente, id_medico, id_consulta, tipo, descripcion, fecha_expiracion,
        instrucciones, estado } = req.body

    try {
        const nuevoAutorizacion = await AutorizacionProcedimientoExamenFacade.crearAutorizacionProcedimientoExamenes(
            id_paciente, id_medico, id_consulta, tipo, descripcion, fecha_expiracion,
            instrucciones, estado
        )
        res.status(201).json(nuevoAutorizacion)
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al crear Autorizacion Procedimiento/Examen' })
    }
}

const actualizarAutorizacionProcedimientoExamen = async (req, res) => {
    const { idAutorizacion } = req.params
    const { estado } = req.body

    try {
        const AutorizacionActualizada = await AutorizacionProcedimientoExamenFacade.actualizarAutorizacionProcedimientoExamen(idAutorizacion, estado)
        if (!AutorizacionActualizada) {
            return res.status(404).json({ mensaje: 'Autorizacion Procedimiento/Examen no encontrada' })
        }
        res.json(AutorizacionActualizada)
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al actualizar Autorizacion Procedimiento/Examen' })
    }
}

const eliminarAutorizacionProcedimientoExamenes = async (req, res) => {
    const { idAutorizacion } = req.params

    try {
        await AutorizacionProcedimientoExamenFacade.eliminarAutorizacionMedica(idAutorizacion)
        res.json({ mensaje: 'Autorizacion Procedimiento/Examen eliminada exitosamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al eliminar Autorizacion Autorizacion Procedimiento/Examen' })
    }
}

module.exports = {
    obtenerAutorizacionProcedimientoExamen,
    crearAutorizacionProcedimientoExamen,
    actualizarAutorizacionProcedimientoExamen,
    eliminarAutorizacionProcedimientoExamenes,
    generarPdf
}