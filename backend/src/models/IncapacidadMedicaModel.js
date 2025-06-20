const pool = require('../config/db')

const crearIncapacidadMedica = async (idPaciente, idMedico, idConsulta, fechaInicio, fechaFin, diasIncapacidad, diagnostico, recomendaciones) => {
    const resultado = await pool.query(
        `INSERT INTO Incapacidad_Medica (id_paciente, id_medico, id_consulta, fecha_emision, fecha_inicio, fecha_fin, dias_incapacidad, diagnostico, recomendaciones)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6, $7, $8) RETURNING *`,
        [idPaciente, idMedico, idConsulta, fechaInicio, fechaFin, diasIncapacidad, diagnostico, recomendaciones]
    )
    return resultado.rows[0]
}

const obtenerIncapacidadesPorId = async (idIncapacidad) => {

    console.log("Buscando incapacidad con ID:", idIncapacidad);

    const resultado = await pool.query(
        `SELECT 
  im.*, 
    p.nombre AS nombre_paciente,
    m.nombre AS nombre_medico
    FROM incapacidad_medica im
    INNER JOIN paciente p ON im.id_paciente = p.id_paciente
    INNER JOIN medico m ON im.id_medico = m.id_medico
    WHERE im.id_incapacidad = $1 AND fecha_fin >= NOW()
    ORDER BY im.fecha_emision DESC`,
        [idIncapacidad]
    )
    return resultado.rows[0]
}

const obtenerIncapacidadesPorPaciente = async (idPaciente) => {
    const resultado = await pool.query(
        `SELECT 
  im.*, 
    p.nombre AS nombre_paciente,
    m.nombre AS nombre_medico
    FROM incapacidad_medica im
    INNER JOIN paciente p ON im.id_paciente = p.id_paciente
    INNER JOIN medico m ON im.id_medico = m.id_medico
    WHERE im.id_paciente = $1
    ORDER BY im.fecha_emision DESC`,
        [idPaciente]
    )
    return resultado.rows
}

const actualizarIncapacidadMedica = async (idIncapacidad, estado) => {
    const resultado = await pool.query(
        `UPDATE Incapacidad_Medica SET estado = $1 WHERE id_incapacidad = $2 RETURNING *`,
        [estado, idIncapacidad]
    )
    return resultado.rows[0]
}

const eliminarIncapacidadMedica = async (idIncapacidad) => {
    await pool.query('DELETE FROM Incapacidad_Medica WHERE id_incapacidad = $1', [idIncapacidad])
}

module.exports = {
    obtenerIncapacidadesPorPaciente,
    crearIncapacidadMedica,
    actualizarIncapacidadMedica,
    eliminarIncapacidadMedica,
    obtenerIncapacidadesPorId
};

