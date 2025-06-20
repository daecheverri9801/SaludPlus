const db = require('../config/db')

const buscarPacientePorUID = async (uid) => {
  const resultado = await db.query(
    "SELECT id_paciente AS id, nombre, correo_electronico FROM paciente WHERE idauth = $1",
    [uid]
  )
  return resultado.rows[0]
}

const buscarMedicoPorUID = async (uid) => {
  const resultado = await db.query(
    "SELECT id_medico AS id, nombre, correo_electronico FROM medico WHERE idauth = $1",
    [uid]
  )
  return resultado.rows[0]
}

module.exports = {
  buscarPacientePorUID,
  buscarMedicoPorUID
}
