const pool = require('../config/db')

const crearAutorizacionMedicamento = async (id_paciente, id_medico, id_consulta, medicamento, dosis, 
    frecuencia, duracion, fecha_expiracion, justificacion, estado) => {
    const resultado = await pool.query(
        `INSERT INTO Autorizacion_Medicamento (id_paciente, id_medico, id_consulta, medicamento, dosis, frecuencia, duracion, fecha_emision, fecha_expiracion, justificacion, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8, $9, $10) RETURNING *`,
       [id_paciente, id_medico, id_consulta, medicamento, dosis, frecuencia, duracion, fecha_expiracion, justificacion, estado]
    )
    return resultado.rows[0]
}

const obtenerAutorizacionPorPaciente = async (idPaciente) => {
    const resultado = await pool.query(
        `SELECT 
            am.*, 
            p.nombre AS nombre_paciente,
            m.nombre AS nombre_medico
        FROM Autorizacion_Medicamento am
        INNER JOIN Paciente p ON am.id_paciente = p.id_paciente
        INNER JOIN Medico m ON am.id_medico = m.id_medico
        WHERE am.id_paciente = $1 and fecha_expiracion >= NOW()
        ORDER BY am.fecha_emision DESC`,
        [idPaciente]
    )
    return resultado.rows
}

const obtenerAutorizacionPorId = async (idAutorizacion) => {
    const resultado = await pool.query(
        `SELECT 
            am.*, 
            p.nombre AS nombre_paciente,
            m.nombre AS nombre_medico
        FROM Autorizacion_Medicamento am
        INNER JOIN Paciente p ON am.id_paciente = p.id_paciente
        INNER JOIN Medico m ON am.id_medico = m.id_medico
        WHERE am.id_autorizacion = $1 and fecha_expiracion >= NOW()
        ORDER BY am.fecha_emision DESC`,
        [idAutorizacion]
    )
    return resultado.rows
}

const actualizarAutorizacionMedica = async (idAutorizacion, estado) => {
    const resultado = await pool.query(
        `UPDATE Autorizacion_Medicamento SET estado = $1 WHERE id_autorizacion = $2 RETURNING *`,
        [estado, idAutorizacion]
    )
    return resultado.rows[0]
}

const eliminarAutorizacionMedica = async (idAutorizacion) => {
    await pool.query('DELETE FROM Autorizacion_Medicamento WHERE id_autorizacion = $1', [idAutorizacion])
}

module.exports = {
    crearAutorizacionMedicamento,
    obtenerAutorizacionPorPaciente,
    actualizarAutorizacionMedica,
    eliminarAutorizacionMedica,
    obtenerAutorizacionPorId
}