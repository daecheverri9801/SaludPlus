const incapacidadMedica = require('../models/IncapacidadMedicaModel')
const { generarPdfIncapacidad, enviarPdfPorCorreo } = require('../services/IncapacidadServicePdf')
const fs = require('fs');

const generarPdf = async (req, res) => {
    const { idIncapacidad } = req.params;

    try {
        const incapacidad = await incapacidadMedica.obtenerIncapacidadesPorId(idIncapacidad)

        console.log(incapacidad)

        if (!incapacidad) {
            return res.status(404).json({ mensaje: 'No se encontró incapacidad para este id.' })
        }

        const pdfPath = await generarPdfIncapacidad({
            nombrePaciente: incapacidad.nombre_paciente || 'Paciente desconocido',
            nombreMedico: incapacidad.nombre_medico || 'Médico desconocido',
            diagnostico: incapacidad.diagnostico,
            fechaInicio: incapacidad.fecha_inicio,
            fechaFin: incapacidad.fecha_fin,
            diasIncapacidad: incapacidad.dias_incapacidad,
            recomendaciones: incapacidad.recomendaciones
        })

        res.download(pdfPath)
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al generar el PDF.' })
    }
}

const enviarIncapacidadPorCorreo = async (req, res) => {
    const { id } = req.params
    const { emailDestino } = req.body

    try {
        const incapacidad = await incapacidadMedica.obtenerIncapacidadesPorId(id)
        
        if (!incapacidad || incapacidades.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontró la incapacidad.' })
        }


        const pdfPath = await generarPdfIncapacidad({
            nombrePaciente: incapacidad.nombre_paciente || 'Paciente desconocido',
            nombreMedico: incapacidad.nombre_medico || 'Médico desconocido',
            diagnostico: incapacidad.diagnostico,
            fechaInicio: incapacidad.fecha_inicio,
            fechaFin: incapacidad.fecha_fin,
            diasIncapacidad: incapacidad.dias_incapacidad,
            recomendaciones: incapacidad.recomendaciones
        })

        await enviarPdfPorCorreo(emailDestino, pdfPath);

        fs.unlinkSync(pdfPath)

        res.json({ mensaje: 'Correo enviado exitosamente con la incapacidad médica adjunta.' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al enviar incapacidad por correo.' })
    }
}


const obtenerIncapacidadesPorPaciente = async (req, res) => {
    const { id } = req.params

    try {
        const incapacidades = await incapacidadMedica.obtenerIncapacidadesPorPaciente(id)

        if (!incapacidades || incapacidades.length === 0) {
            return res.status(404).json({ mensaje: 'No hay incapacidades activas para el paciente o ya expiraron.' });
        }

        res.json(incapacidades)

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener incapacidades' });
    }
}

const crearIncapacidadMedica = async (req, res) => {
    const { idPaciente, idMedico, idConsulta, fechaInicio, fechaFin, diagnostico, recomendaciones } = req.body

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferenciaMs = fin - inicio;

    if (isNaN(inicio) || isNaN(fin) || diferenciaMs < 0) {
      return res.status(400).json({ mensaje: 'Fechas inválidas: la fecha de fin debe ser posterior a la de inicio' });
    }

    const diasIncapacidad = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24)) + 1;

    try {
        const nuevaIncapacidad = await incapacidadMedica.crearIncapacidadMedica(idPaciente, idMedico, idConsulta, fechaInicio, fechaFin, diasIncapacidad, diagnostico, recomendaciones)
        res.status(201).json(nuevaIncapacidad);
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al crear Incapacidad' })
    }
}

const actualizarIncapacidadMedica = async (req, res) => {
    const idIncapacidad = req.params.id;
    const { estado } = req.body;

    try {
        const incapacidadActualizada = await incapacidadMedica.actualizarIncapacidadMedica(idIncapacidad, estado);
        if (!incapacidadActualizada) {
            return res.status(404).json({ mensaje: 'Incapacidad no encontrada' })
        }
        res.json(incapacidadActualizada)
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al actualizar Incapacidad' })
    }
}

const eliminarIncapacidadMedica = async (req, res) => {
    const { idIncapacidad } = req.params

    try {
        await incapacidadMedica.eliminarIncapacidadMedica(idIncapacidad)
        res.json({ mensaje: 'incapacidad eliminada exitosamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al eliminar incapacidad' })
    }
}

module.exports = {
    obtenerIncapacidadesPorPaciente,
    crearIncapacidadMedica,
    actualizarIncapacidadMedica,
    eliminarIncapacidadMedica,
    enviarIncapacidadPorCorreo,
    generarPdf
}
