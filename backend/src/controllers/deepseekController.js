const { generarRespuesta } = require('../services/deepseek/deepseekService')

const handleChat = async (req, res) => {
  const { sintomas, nombre_paciente, edad, sexo, Act_Fisica, peso, estado_civil, ocupacion, model } = req.body
  if (!sintomas) return res.status(400).json({ error: 'El mensaje es requerido' })
  try {
    const respuestaJSON = await generarRespuesta(
      sintomas, nombre_paciente, edad, sexo, Act_Fisica, peso, estado_civil, ocupacion, model
    )
    res.status(200).json(respuestaJSON)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


module.exports = {
  handleChat,
}
