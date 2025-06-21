const AutorizacionMedicamentoFacade = require('../services/facade/autorizacionMedicamentoFacade')
const ExportarPDFAutorizacionMedicamentos = require('../services/reportes/strategies/autorizacionMedicamentoPdf')
const fs = require('fs')
const ReporteAutorizacionMedicamentos = require('../services/reportes/tipos/reporteAutorizacionMedicamentos')
const ReporteService = require('../services/reportes/reporteService')

const generarPdf = async (req, res) => {
  const { idAutorizacion } = req.params

  try {
    const autorizacion = await AutorizacionMedicamentoFacade.obtenerAutorizacionMedicamentoPorId(idAutorizacion)

    console.log(autorizacion)

    if (!autorizacion) {
      return res.status(404).json({ mensaje: 'No se encontró incapacidad para este ID.' })
    }

    const reporte = new ReporteAutorizacionMedicamentos(autorizacion[0])
    console.log("reporte desde controller", reporte)
    const estrategia = new ExportarPDFAutorizacionMedicamentos()
    console.log("estrategia desde controller", estrategia)

    const servicio = new ReporteService(reporte, estrategia)
    console.log("servicio", servicio.reporte)
    const filePath = await servicio.generar()

    res.download(filePath)
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al generar el PDF de incapacidad médica' })
  }
}


const obtenerAutorizacionMedicamento = async (req, res) => {
    const { id } = req.params

    try {
        const Autorizacion = await AutorizacionMedicamentoFacade.obtenerAutorizacionMedicamentoPorPaciente(id)

        if (!Autorizacion || Autorizacion.length === 0) {
            return res.status(404).json({ mensaje: 'No hay autorizaciones activas para el paciente o ya expiraron.' })
        }

        res.json(Autorizacion)

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener Autorizacion clínico' })
    }
}

const crearAutorizacion = async (req, res) => {
    const { id_paciente, id_medico, id_consulta, medicamento, dosis, 
        frecuencia, duracion, fecha_expiracion, justificacion, estado } = req.body

    try {
        const nuevoAutorizacion = await AutorizacionMedicamentoFacade.crearAutorizacionMedicamento(id_paciente, id_medico, id_consulta, medicamento, dosis, 
            frecuencia, duracion, fecha_expiracion, justificacion, estado)
        res.status(201).json(nuevoAutorizacion)
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al crear Autorizacion clínico' })
    }
}

const actualizarHistorial = async (req, res) => {
    const { idConsulta } = req.params
    const { motivo, observaciones } = req.body

    try {
        const consultaActualizada = await HistorialFacade.actualizarHistorial(idConsulta, motivo, observaciones)
        if (!consultaActualizada) {
            return res.status(404).json({ mensaje: 'Consulta no encontrada' })
        }
        res.json(consultaActualizada)
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al actualizar historial clínico' })
    }
}

const eliminarAutorizacionMedica = async (req, res) => {
    const { idAutorizacion } = req.params

    try {
        await AutorizacionMedicamentoFacade.eliminarAutorizacionMedica(idAutorizacion)
        res.json({ mensaje: 'Autorizacion eliminada exitosamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al eliminar Autorizacion' })
    }
}

module.exports = {
    obtenerAutorizacionMedicamento,
    crearAutorizacion,
    actualizarHistorial,
    eliminarAutorizacionMedica,
    generarPdf
}