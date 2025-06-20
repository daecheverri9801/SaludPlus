const Medico = require('../models/medicoModel')
const MedicoBuilder = require('../services/builder/medicoBuilder')

const crearMedico = async (req, res) => {
    try {
        const {
            nombre, especialidad, registro_medico, correo_electronico, idauth, cedula, direccion, celular
        } = req.body;
        const medico = new MedicoBuilder()
            .setNombre(nombre)
            .setEspecialidad(especialidad)
            .setRegistroMedico(registro_medico)
            .setCorreo(correo_electronico)
            .setIdAuth(idauth)
            .setCedula(cedula)
            .setDireccion(direccion)
            .setCelular(celular)
            .build()

        const nuevo = await Medico.crearMedico(medico)
        res.json(nuevo)
    } catch (error) {
        res.status(500).json({ error: 'Error al crear médico', detalle: error.message })
    }
}

const listarMedicos = async (req, res) => {
    try {
        const medicos = await Medico.obtenerMedicos();
        res.json(medicos)
    } catch (error) {
        res.status(500).json({ error: 'Error al listar médicos' })
    }
}

const obtenerPorId = async (req, res) => {
    try {
        const medico = await Medico.obtenerMedicoPorId(req.params.id);
        if (!medico) return res.status(404).json({ mensaje: 'Médico no encontrado' })
        res.json(medico)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener médico' })
    }
}

const actualizarMedio = async (req, res) => {
    try {
        const medico = await Medico.actualizarMedico(req.params.id, req.body)
        res.json(medico);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar médico' })
    }
}

const eliminarMedico = async (req, res) => {
    try {
        const medico = await Medico.eliminarMedico(req.params.id)
        res.json(medico)
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar médico' })
    }
}

module.exports = {
    crearMedico,
    listarMedicos,
    obtenerPorId,
    actualizarMedio,
    eliminarMedico
}