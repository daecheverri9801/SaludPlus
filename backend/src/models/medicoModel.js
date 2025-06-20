const db = require('../config/db')

const crearMedico = async ( medico ) => {
    const { nombre, especialidad, registro_medico, correo_electronico, idauth, cedula, direccion, celular } = medico
    const result = await db.query(
        `INSERT INTO Medico (nombre, especialidad, registro_medico, correo_electronico, idauth, cedula, direccion, celular)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [nombre, especialidad, registro_medico, correo_electronico, idauth, cedula, direccion, celular]
    )
    return result.rows[0]
}

const obtenerMedicos = async () => {
    const result = await db.query(`SELECT * FROM Medico`);
    return result.rows;
}

const obtenerMedicoPorId = async (id) => {
    const result = await db.query(`SELECT * FROM Medico WHERE id_medico = $1`, [id])
    return result.rows[0]
}

const actualizarMedico = async (id, datos) => {
    const { nombre, especialidad, registro_medico, correo_electronico } = datos
    const result = await db.query(
        `UPDATE Medico SET nombre=$1, especialidad=$2, registro_medico=$3, correo_electronico=$4 WHERE id_medico=$5 RETURNING *`,
        [nombre, especialidad, registro_medico, correo_electronico, id]
    )
    return result.rows[0]
}

const eliminarMedico = async (id) => {
    const result = await db.query(`DELETE FROM Medico WHERE id_medico = $1 RETURNING *`, [id])
    return result.rows[0]
}

module.exports = {
    crearMedico,
    obtenerMedicos,
    obtenerMedicoPorId,
    actualizarMedico,
    eliminarMedico
}