const { buscarPacientePorUID, buscarMedicoPorUID } = require('../models/authModel')

const loginConUID = async (req, res) => {
  const uid = req.body.idauth
  try {
    const medico = await buscarMedicoPorUID(uid)
    if (medico) {
      return res.status(200).json({
        id: medico.id,
        uid,
        email: medico.correo_electronico,
        nombre: medico.nombre,
        tipo: "medico"
      })
    }
  
    const paciente = await buscarPacientePorUID(uid)
    if (paciente) {
      return res.status(200).json({
        id: paciente.id,
        uid,
        email: paciente.correo_electronico,
        nombre: paciente.nombre,
        tipo: "paciente"
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(404).json({ mensaje: "Usuario no registrado en el sistema..."}) 
  }
}

module.exports = {
    loginConUID
}
