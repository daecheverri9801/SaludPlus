const db = require("../config/db");

const crearPaciente = async (paciente) => {
  const {
    usuario,
    nombre,
    cedula,
    correo_electronico,
    idauth,
    celular,
    direccion,
  } = paciente
  const resultado = await db.query(
    `INSERT INTO Paciente (usuario, nombre, cedula, correo_electronico, idauth, celular, direccion)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      usuario,
      nombre,
      cedula,
      correo_electronico,
      idauth,
      celular,
      direccion,
    ]
  )
  return resultado.rows[0]
}

const obtenerTodosLosPacientes = async () => {
  const resultado = await db.query(
    "SELECT * FROM Paciente ORDER BY id_paciente ASC"
  )
  return resultado.rows
}

const obtenerPacientePorId = async (id) => {
  const resultado = await db.query(
    "SELECT * FROM Paciente WHERE id_paciente = $1",
    [id]
  )
  return resultado.rows[0]
}

const actualizarPaciente = async (id, datos) => {
  try {
    const { correo_electronico, celular, direccion } = datos
    const res = await db.query(
      `UPDATE Paciente SET correo_electronico=$1, celular=$2, direccion=$3
       WHERE id_paciente=$4 RETURNING *`,
      [correo_electronico, celular, direccion, id]
    )
    return res.rows[0]
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al eliminar paciente model" })
  }
}

const eliminar = async (id) => {
  await db.query("DELETE FROM Paciente WHERE id_paciente = $1", [id])
}

module.exports = {
  obtenerTodosLosPacientes,
  obtenerPacientePorId,
  crearPaciente,
  actualizarPaciente,
  eliminar,
}
