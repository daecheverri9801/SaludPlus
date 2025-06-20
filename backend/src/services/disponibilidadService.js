const { getCitasPorMedicoYFecha } = require('../models/citaMedicaModel')
const HORARIOS = require('../utils/horario')

function generarEspaciosParaHorario(fecha, horario) {
    const espacios = []
    const [year, month, day] = fecha.split('-').map(Number)
    for (let h = horario.inicio; h < horario.fin; h++) {
        const espacio = new Date(year, month - 1, day, h, 0, 0)
        espacios.push(espacio)
    }
    return espacios
}

async function getDisponibilidadDiaria(idMedico, fechaYYYYMMDD) {

  const ocupadas = await getCitasPorMedicoYFecha(idMedico, fechaYYYYMMDD)

  const d = new Date(fechaYYYYMMDD)
  const dow = d.getDay()

  let horario
  if (dow >= 1 && dow <= 5)      horario = HORARIOS.lunesAViernes
  else if (dow === 6)            horario = HORARIOS.sabado
  else                           return []

  const todos = generarEspaciosParaHorario(fechaYYYYMMDD, horario)

  const ocupadasTimestamps = new Set(ocupadas.map(d => d.getTime()))
  const disponibles = todos.filter(slot => !ocupadasTimestamps.has(slot.getTime()))

  return disponibles
}

module.exports = {
  getDisponibilidadDiaria
}