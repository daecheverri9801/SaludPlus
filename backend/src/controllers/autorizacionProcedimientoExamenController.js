const AutorizacionProcedimientoExamenFacade = require('../services/facade/autorizacionProcedimientoExamenFacade')
const { generarPdfAutorizacionProcedimiento, enviarPdfPorCorreo } = require('../services/autorizacionProcedimientoExamen')
const fs = require('fs');

const generarPdf = async (req, res) => {
    const { idAutorizacion } = req.params;

    try {
        const autorizaciones = await AutorizacionProcedimientoExamenFacade.obtenerAutorizacionProcedimientoExamenesPorId(idAutorizacion)

        if (!autorizaciones || autorizaciones.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontró autorización Procedimient/Examen para este paciente.' })
        }

        const autorizacion = autorizaciones[0]

        const pdfPath = await generarPdfAutorizacionProcedimiento({
            nombrePaciente: autorizacion.nombre_paciente || 'Paciente desconocido',
            nombreMedico: autorizacion.nombre_medico || 'Médico desconocido',
            idConsulta: autorizacion.id_consulta,
            tipo: autorizacion.tipo,
            descripcion: autorizacion.descripcion,
            instrucciones: autorizacion.instrucciones,
            fechaEmision: autorizacion.fecha_emision,
            fechaExpiracion: autorizacion.fecha_expiracion,
            estado: autorizacion.estado
        })

        res.download(pdfPath)
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al generar el PDF de Autorización Procedimient/Examen.' })
    }
}


const obtenerAutorizacionProcedimientoExamen = async (req, res) => {
    const { id } = req.params

    try {
        const Autorizacion = await AutorizacionProcedimientoExamenFacade.obtenerAutorizacionProcedimientoExamenesPorPaciente(id)

        if (!Autorizacion || Autorizacion.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontró autorizacion Procedimiento/Examen para este paciente.' });
        }

        res.json(Autorizacion)

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener Autorizacion Procedimiento/Examen' });
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
        res.status(201).json(nuevoAutorizacion);
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