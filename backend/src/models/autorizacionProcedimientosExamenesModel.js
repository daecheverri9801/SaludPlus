const { json } = require('express')
const pool = require('../config/db')

const crearAutorizacionProcedimientoExamenes = async (id_paciente, id_medico, id_consulta, tipo, descripcion, fecha_expiracion,
    instrucciones, estado
) => {
    const resultado = await pool.query(
        `INSERT INTO autorizacion_examen_procedimiento (id_paciente, id_medico, id_consulta, tipo, descripcion, fecha_emision,
         fecha_expiracion, instrucciones, estado)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7, $8) RETURNING *
         `,
        [id_paciente, id_medico, id_consulta, tipo, descripcion, fecha_expiracion, instrucciones, estado]
    )
    return resultado.rows[0]
}

const obtenerAutorizacionProcedimientoExamenesPorPaciente = async (idPaciente) => {
    const resultado = await pool.query(
        `SELECT 
        ape.*, 
        p.nombre AS nombre_paciente,
        m.nombre AS nombre_medico
    FROM autorizacion_examen_procedimiento ape
    INNER JOIN Paciente p ON ape.id_paciente = p.id_paciente
    INNER JOIN Medico m ON ape.id_medico = m.id_medico
    WHERE ape.id_paciente = $1 AND fecha_expiracion >= NOW()
    ORDER BY ape.fecha_emision DESC`,
        [idPaciente]
    )
    return resultado.rows
}

const obtenerAutorizacionProcedimientoExamenesPorId = async (idAutorizacion) => {
    const resultado = await pool.query(
        `SELECT 
        ape.*, 
        p.nombre AS nombre_paciente,
        m.nombre AS nombre_medico
    FROM autorizacion_examen_procedimiento ape
    INNER JOIN Paciente p ON ape.id_paciente = p.id_paciente
    INNER JOIN Medico m ON ape.id_medico = m.id_medico
    WHERE ape.id_autorizacion = $1 AND fecha_expiracion >= NOW()
    ORDER BY ape.fecha_emision DESC`,
        [idAutorizacion]
    )
    return resultado.rows
}


const actulizarAutorizacionProcedimientoExamenes = async (idAutorizacion, estado) => {
    const resultado = await pool.query(
        `UPDATE autorizacion_examen_procedimiento SET estado = $1 WHERE id_autorizacion = $2 RETURNING *`,
        [estado, idAutorizacion]
    )
    return resultado.rows[0]
}

const eliminarAutorizacionProcedimientoExamenes = async (idAutorizacion) => {
    await pool.query('DELETE FROM autorizacion_examen_procedimiento WHERE id_autorizacion = $1', [idAutorizacion])
}

module.exports = {
    crearAutorizacionProcedimientoExamenes,
    obtenerAutorizacionProcedimientoExamenesPorPaciente,
    actulizarAutorizacionProcedimientoExamenes,
    eliminarAutorizacionProcedimientoExamenes,
    obtenerAutorizacionProcedimientoExamenesPorId
}