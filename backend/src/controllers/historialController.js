const HistorialFacade = require('../services/facade/historialFacade')

const obtenerHistorial = async (req, res) => {
    const { id } = req.params

    try {
        const historial = await HistorialFacade.obtenerHistorialPorPaciente(id)

        if (!historial || historial.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontró historial para este paciente.' });
        }

        res.json(historial)

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener historial clínico', error: error.message });
    }
}

const obtenerHistorialId = async (req, res) => {
    const { idPaciente, idHistorial } = req.params

    try {
        const historial = await HistorialFacade.obtenerHistorialPorId(idPaciente, idHistorial)

        if (!historial || historial.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontró historial para este paciente.' });
        }

        res.json(historial)

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener historial clínico controller' });
    }
}

const crearHistorial = async (req, res) => {
    const { idPaciente, idMedico, motivo, observaciones, codigo_icd, descripcion, tratamiento, fecha_consulta } = req.body

    try {
        const nuevoHistorial = await HistorialFacade.crearHistorial(idPaciente, idMedico,  motivo, observaciones, codigo_icd, descripcion, tratamiento, fecha_consulta)
        res.status(201).json(nuevoHistorial);
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al crear historial clínico' })
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

const eliminarConsulta = async (req, res) => {
    const { idConsulta } = req.params

    try {
        await HistorialFacade.eliminarConsulta(idConsulta)
        res.json({ mensaje: 'Consulta eliminada exitosamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al eliminar consulta' })
    }
}

module.exports = {
    obtenerHistorial,
    crearHistorial,
    actualizarHistorial,
    eliminarConsulta,
    obtenerHistorialId
}