const HistorialClinicoModel = require('../../models/historialModel')

const crearHistorial = async (idPaciente, idMedico, motivo, observaciones, codigo_icd, descripcion, tratamiento, fecha_consulta) => {
    try {
        const nuevoHistorial = await HistorialClinicoModel.crearHistorial(idPaciente, idMedico, motivo, observaciones, codigo_icd, descripcion, tratamiento, fecha_consulta)
        return nuevoHistorial
    } catch (error) {
        throw new Error('Error al crear historial clínico')
    }
}

const obtenerHistorialPorPaciente = async (idPaciente) => {
    try {
        const historial = await HistorialClinicoModel.obtenerHistorialPorPaciente(idPaciente);
        if (!historial || historial.length === 0) {
            throw new Error('No se encontró historial para este paciente')
        }
        return historial
    } catch (error) {
        throw new Error('Error al obtener historial clínico', error.message);   
    }
}

const obtenerHistorialPorId = async (idPaciente, idHistorial) => {
    try {
        const historial = await HistorialClinicoModel.obtenerHistorialPorId(idPaciente, idHistorial);
        if (!historial || historial.length === 0) {
            throw new Error('No se encontró historial con este ID')
        }
        return historial
    } catch (error) {
        throw new Error('Error al obtener historial clínico...')   
    }
}

const actualizarHistorial = async (idConsulta, motivo, observaciones) => {
    try {
        const consultaActualizada = await HistorialClinicoModel.actualizarHistorial(idConsulta, motivo, observaciones)
        return consultaActualizada
    } catch (error) {
        throw new Error('Error al actualizar consulta')
    }
}

const eliminarConsulta = async (idConsulta) => {
    try {
        await HistorialClinicoModel.eliminarConsulta(idConsulta)
        return { mensaje: 'Consulta eliminada exitosamente' }
    } catch (error) {
        throw new Error('Error al eliminar consulta')
    }
}

module.exports = {
    crearHistorial,
    obtenerHistorialPorPaciente,
    actualizarHistorial,
    eliminarConsulta,
    obtenerHistorialPorId
}