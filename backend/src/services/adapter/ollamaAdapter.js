class OllamaAdapter {
  constructor(client) {
    this.client = client;
  }

  async obtenerDiagnostico({ sintomas, id_paciente, nombre_paciente, edad, sexo, Act_Fisica, peso, estado_civil, ocupacion }, model) {
    const prompt = this.construirPrompt(sintomas, id_paciente, nombre_paciente, edad, sexo, Act_Fisica, peso, estado_civil, ocupacion);
    const respuesta = await this.client.generarRespuesta(prompt, model);
    return this.parsearRespuesta(respuesta);
  }

  construirPrompt(sintomas, id_paciente, nombre_paciente, edad, sexo, Act_Fisica, peso, estado_civil, ocupacion) {
    return `
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
  }

  parsearRespuesta(respuesta) {
    let parsed = {};
    try {
      parsed = JSON.parse(respuesta.response);
    } catch (error) {
      throw new Error('La respuesta del modelo no es JSON válido.');
    }
    return parsed;
  }
}

module.exports = OllamaAdapter
