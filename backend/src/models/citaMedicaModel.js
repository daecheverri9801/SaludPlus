const pool = require("../config/db");

const getCitas = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT cm.*, p.nombre AS nombre_paciente, m.nombre AS nombre_medico
      FROM cita_medica cm
      INNER JOIN paciente p ON cm.id_paciente = p.id_paciente
      INNER JOIN medico m ON cm.id_medico = m.id_medico
      ORDER BY cm.fecha_cita ASC
    `);
    return resultado.rows
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: "Error al obtener las citas médicas" })
  }
}

const getCitasPorMedicoYFecha = async (idMedico, fechaYYYYMMDD) => {
  const result = await pool.query(
    `
    SELECT fecha_cita
    FROM cita_medica
    WHERE id_medico = $1
      AND DATE(fecha_cita) = $2
  `,
    [idMedico, fechaYYYYMMDD]
  )

  return result.rows.map((r) => new Date(r.fecha_cita))
}

const getCitasPorMedico = async (idMedico) => {
  try {
    const resultado = await pool.query(
      `
      SELECT 
        cm.*, 
        p.nombre AS nombre_paciente, 
        m.nombre AS nombre_medico
      FROM cita_medica cm
      INNER JOIN paciente p ON cm.id_paciente = p.id_paciente
      INNER JOIN medico m ON cm.id_medico = m.id_medico
      WHERE cm.id_medico = $1
      ORDER BY cm.fecha_cita ASC
    `,
      [idMedico]
    );

    return resultado.rows
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: "Error al obtener las citas del médico" })
  }
}

const getCitasPorPaciente = async (idPaciente) => {
  try {
    const resultado = await pool.query(
      `
      SELECT 
        cm.*,
        p.id_paciente AS id_paciente,
        p.nombre AS nombre_paciente, 
        m.id_medico AS id_medico,        
        m.nombre AS nombre_medico
      FROM cita_medica cm
      INNER JOIN paciente p ON cm.id_paciente = p.id_paciente
      INNER JOIN medico m ON cm.id_medico = m.id_medico
      WHERE cm.id_paciente = $1
      ORDER BY cm.fecha_cita ASC
    `,
      [idPaciente]
    );

    return resultado.rows;
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las citas del médico" });
  }
};

const crearCita = async (id_paciente, id_medico, fecha_cita, motivo) => {
  const conflictoDeHorarios = await pool.query(
    `
    SELECT 1
    FROM cita_medica
    WHERE id_medico = $1
      AND fecha_cita = $2
  `,
    [id_medico, fecha_cita]
  )

  if (conflictoDeHorarios.rowCount > 0) {
    throw new Error("El médico ya tiene una cita en ese horario.")
  }

  const result = await pool.query(
    `
    INSERT INTO cita_medica (id_paciente, id_medico, fecha_cita, motivo)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,
    [id_paciente, id_medico, fecha_cita, motivo]
  )
  return result.rows[0]
}

const actualizarCita = async (req, res) => {
  const { id } = req.params
  const { fecha_cita, motivo, estado } = req.body
  try {
    const result = await pool.query(
      `
      UPDATE cita_medica
      SET fecha_cita = $1, motivo = $2, estado = $3
      WHERE id_cita = $4
      RETURNING *
    `,
      [fecha_cita, motivo, estado, id]
    )
    if (result.rowCount === 0)
      return res.status(404).json({ mensaje: "Cita no encontrada" })
    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: "Error al actualizar la cita médica" })
  }
}

const eliminarCita = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM cita_medica WHERE id_cita = $1",
      [id]
    )
    if (result.rowCount === 0)
      return res.status(404).json({ mensaje: "Cita no encontrada" })
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  getCitas,
  getCitasPorMedico,
  crearCita,
  actualizarCita,
  eliminarCita,
  getCitasPorPaciente,
  getCitasPorMedicoYFecha,
}
