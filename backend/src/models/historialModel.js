const db = require('../config/db')

const obtenerHistorialPorPaciente = async (idPaciente) => {
    const resultado = await db.query(`
    SELECT
      hc.id_historial,
      c.id_consulta,
      c.fecha_consulta,
      c.motivo,
      c.observaciones,
      d.codigo_icd,
      d.descripcion,
      d.tratamiento
    FROM Historial_Clinico hc
    INNER JOIN Consulta c ON hc.id_historial = c.id_historial
    LEFT JOIN Diagnostico d ON c.id_consulta = d.id_consulta
    WHERE hc.id_paciente = $1
    ORDER BY c.fecha_consulta DESC
        `, [idPaciente]
    )
    return resultado.rows
}

const obtenerHistorialPorId = async (idPaciente, idHistorial) => {
    const resultado = await db.query(`
    SELECT
      hc.id_historial,
      c.id_consulta,
      c.fecha_consulta,
      c.motivo,
      c.observaciones,
      d.codigo_icd,
      d.descripcion,
      d.tratamiento
    FROM Historial_Clinico hc
    INNER JOIN Consulta c ON hc.id_historial = c.id_historial
    LEFT JOIN Diagnostico d ON c.id_consulta = d.id_consulta
    WHERE hc.id_paciente = $1 AND hc.id_historial = $2
    ORDER BY c.fecha_consulta DESC
        `, [idPaciente, idHistorial]
    )
    return resultado.rows
}

const crearHistorial = async (idPaciente, idMedico, motivo, observaciones, codigo_icd, descripcion, tratamiento, fecha_consulta) => {
    const respuestaHistorial = await db.query(
        `INSERT INTO Historial_Clinico (id_paciente) VALUES ($1) RETURNING id_historial`,
        [idPaciente]
    )
    const historialId = respuestaHistorial.rows[0].id_historial

    const resultadoConsulta = await db.query(
        `INSERT INTO Consulta (id_historial, id_medico, fecha_consulta, motivo, observaciones)
         VALUES ($1, $2, $3, $4, $5) RETURNING id_consulta
         `,
        [historialId, idMedico, fecha_consulta, motivo, observaciones]
    )

    const consultaId = resultadoConsulta.rows[0].id_consulta

    const respuestaDiagnostico = await db.query(
        `INSERT INTO Diagnostico (id_consulta, codigo_icd, descripcion, tratamiento)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [consultaId, codigo_icd, descripcion, tratamiento]
    )

    return {
        historialId,
        consultaId,
        diagnostico: respuestaDiagnostico.rows[0]
    }
}

const actualizarHistorial = async (idConsulta, motivo, observaciones) => {
    const res = await db.query(
        `UPDATE Consulta SET motivo = $1, observaciones = $2 WHERE id_consulta = $3 RETURNING *`,
        [motivo, observaciones, idConsulta]
    )
    return res.rows[0];
}

const eliminarConsulta = async (idConsulta) => {
    await db.query('DELETE FROM Consulta WHERE id_consulta = $1', [idConsulta])
}

module.exports = {
    obtenerHistorialPorPaciente,
    crearHistorial,
    actualizarHistorial,
    eliminarConsulta,
    obtenerHistorialPorId
}