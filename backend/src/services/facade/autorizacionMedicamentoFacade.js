const AutorizacionMedicamentoModel = require('../../models/AutorizacionMedicamentosModel')

const crearAutorizacionMedicamento = async (id_paciente, id_medico, id_consulta, medicamento, dosis, 
    frecuencia, duracion, fecha_expiracion, justificacion, estado) => {
    try {
        const nuevaAutorizacion = await AutorizacionMedicamentoModel.crearAutorizacionMedicamento(id_paciente, id_medico, id_consulta, medicamento, dosis, 
            frecuencia, duracion, fecha_expiracion, justificacion, estado)
        return nuevaAutorizacion
    } catch (error) {
        console.error('Error real al crear autorización:', error)
        throw new Error('Error al crear Autorizacion Medicamento')
    }
}

const obtenerAutorizacionMedicamentoPorPaciente = async (idPaciente) => {
    try {
        const Autorizacion = await AutorizacionMedicamentoModel.obtenerAutorizacionPorPaciente(idPaciente)
        if (!Autorizacion || Autorizacion.length === 0) {
            throw new Error('No se encontró historial para este paciente')
        }
        return Autorizacion
    } catch (error) {
        throw new Error('Error al obtener Autorizacion')   
    }
}

const obtenerAutorizacionMedicamentoPorId = async (idAutorizacion) => {
    try {
        const Autorizacion = await AutorizacionMedicamentoModel.obtenerAutorizacionPorId(idAutorizacion)
        if (!Autorizacion || Autorizacion.length === 0) {
            throw new Error('No se encontró historial para este id')
        }
        return Autorizacion
    } catch (error) {
        throw new Error('Error al obtener Autorizacion')   
    }
}

const actualizarAutorizacionMedica = async (idAutorizacion, estado) => {
    try {
        const AutorizacionActualizada = await AutorizacionMedicamentoModel.actualizarAutorizacionMedica(idAutorizacion, estado)
        return AutorizacionActualizada
    } catch (error) {
        throw new Error('Error al actualizar Autorizacion')
    }
}

const eliminarAutorizacionMedica = async (idAutorizacion) => {
    try {
        await AutorizacionMedicamentoModel.eliminarAutorizacionMedica(idAutorizacion)
        return { mensaje: 'Autorizacion eliminada exitosamente' }
    } catch (error) {
        throw new Error('Error al eliminar Autorizacion')
    }
}

module.exports = {
    crearAutorizacionMedicamento,
    obtenerAutorizacionMedicamentoPorPaciente,
    actualizarAutorizacionMedica,
    eliminarAutorizacionMedica,
    obtenerAutorizacionMedicamentoPorId
}