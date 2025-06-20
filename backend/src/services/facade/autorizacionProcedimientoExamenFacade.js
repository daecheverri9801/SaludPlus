const AutorizacionProcedimientoExamenes = require('../../models/autorizacionProcedimientosExamenesModel')

const crearAutorizacionProcedimientoExamenes = async (id_paciente, id_medico, id_consulta, tipo, descripcion, fecha_expiracion,
    instrucciones, estado) => {
    try {
        const nuevaAutorizacion = await AutorizacionProcedimientoExamenes.crearAutorizacionProcedimientoExamenes(
            id_paciente, id_medico, id_consulta, tipo, descripcion, fecha_expiracion,
            instrucciones, estado
        )
        return nuevaAutorizacion
    } catch (error) {
        console.error('Error real al crear autorización procedimiento/examen:', error)
        throw new Error('Error real al crear autorización procedimiento/examen')
    }
}

const obtenerAutorizacionProcedimientoExamenesPorPaciente = async (idPaciente) => {
    try {
        const Autorizacion = await AutorizacionProcedimientoExamenes.obtenerAutorizacionProcedimientoExamenesPorPaciente(idPaciente)
        if (!Autorizacion || Autorizacion.length === 0) {
            throw new Error('No se encontró autorizacion Procedimiento/examen para este paciente')
        }
        return Autorizacion
    } catch (error) {
        throw new Error('Error al obtener Autorizacion Procedimiento/examen')   
    }
}

const obtenerAutorizacionProcedimientoExamenesPorId = async (idAutorizacion) => {
    try {
        const Autorizacion = await AutorizacionProcedimientoExamenes.obtenerAutorizacionProcedimientoExamenesPorId(idAutorizacion)
        if (!Autorizacion || Autorizacion.length === 0) {
            throw new Error('No se encontró autorizacion Procedimiento/examen para este paciente')
        }
        return Autorizacion
    } catch (error) {
        throw new Error('Error al obtener Autorizacion Procedimiento/examen')   
    }
}

const actualizarAutorizacionProcedimientoExamen = async (idAutorizacion, estado) => {
    try {
        const AutorizacionActualizada = await AutorizacionProcedimientoExamenes.actulizarAutorizacionProcedimientoExamenes(idAutorizacion, estado)
        return AutorizacionActualizada
    } catch (error) {
        throw new Error('Error al actualizar Autorizacion Procedimiento/examen')
    }
}

const eliminarAutorizacionMedica = async (idAutorizacion) => {
    try {
        await AutorizacionProcedimientoExamenes.eliminarAutorizacionProcedimientoExamenes(idAutorizacion)
        return { mensaje: 'Autorizacion Procedimiento/examen eliminada exitosamente' }
    } catch (error) {
        throw new Error('Error al eliminar Autorizacion Procedimiento/examen')
    }
}

module.exports = {
    crearAutorizacionProcedimientoExamenes,
    obtenerAutorizacionProcedimientoExamenesPorPaciente,
    actualizarAutorizacionProcedimientoExamen,
    eliminarAutorizacionMedica,
    obtenerAutorizacionProcedimientoExamenesPorId
}