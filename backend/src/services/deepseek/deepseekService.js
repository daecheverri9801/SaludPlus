const DeepSeekClient = require('./client')
const OllamaAdapter = require('../adapter/ollamaAdapter')

const ollamaAdapter = new OllamaAdapter(DeepSeekClient)

const generarRespuesta = async (...args) => {
  const params = {
    sintomas: args[0],
    id_paciente: args[1],
    nombre_paciente: args[2],
    edad: args[3],
    sexo: args[4],
    Act_Fisica: args[5],
    peso: args[6],
    estado_civil: args[7],
    ocupacion: args[8]
  };
  return await ollamaAdapter.obtenerDiagnostico(params, 'llama3.2:latest')
}

module.exports = {
  generarRespuesta
}

