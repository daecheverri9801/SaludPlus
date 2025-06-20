const { OLLAMA_URL } = require("../../config/ollamaConfig");
const DeepSeekClient = require("./client");

const generarRespuesta = async (
  sintomas,
  id_paciente,
  nombre_paciente,
  edad,
  sexo,
  Act_Fisica,
  peso,
  estado_civil,
  ocupacion
) => {
  const prompt = `
Eres un médico general. Según los síntomas del paciente, debes generar un diagnóstico en formato JSON.
Sigue exactamente esta estructura. Aquí tienes un ejemplo pero usa el nombre y edad del paciente que te de mandan en los parametros :

{
  "paciente": {
    "id": "${id_paciente}",
    "nombre": "${nombre_paciente}",
    "años": ${edad},
    "genero": "${sexo}"
  },
  "diagnosticos": {
    "fecha": "2025-05-05",
    "condicion": "Faringitis viral",
    "sintomas": ["Dolor de garganta", "Fiebre", "Congestión nasal"],
    "recomendacion": {
      "medicamentos": [
        {
          "nombre": "Paracetamol",
          "dosis": "500 mg",
          "frecuencia": "Cada 8 horas"
        },
        {
          "nombre": "Loratadina",
          "dosis": "10 mg",
          "frecuencia": "Cada 12 horas"
        }
      ],
      "incapacidad": "Reposo por 3 días"
    }
  }
}

Ahora genera un JSON igual para el siguiente paciente:


    Sintomas = ${sintomas}
    datos del paciente :
      ${id_paciente},
      ${nombre_paciente},
      ${edad},
      ${sexo},
      ${Act_Fisica},
      ${peso},
      ${estado_civil},
      ${ocupacion}X

Responde solo con el JSON.
`;

  console.log("\n🔍 Prompt generado:\n", prompt);

  return await DeepSeekClient.generarRespuesta(prompt);
};

module.exports = {
  generarRespuesta,
};
