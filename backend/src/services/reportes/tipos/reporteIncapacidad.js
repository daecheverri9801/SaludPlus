class ReporteIncapacidad {
  constructor(datos) {
    this.datos = datos
  }

  obtenerDatos() {
    return {
      nombrePaciente: this.datos.nombre_paciente || 'Paciente desconocido',
      nombreMedico: this.datos.nombre_medico || 'Médico desconocido',
      diagnostico: this.datos.diagnostico,
      fechaInicio: this.datos.fecha_inicio,
      fechaFin: this.datos.fecha_fin,
      diasIncapacidad: this.datos.dias_incapacidad,
      recomendaciones: this.datos.recomendaciones
    }
  }
}

module.exports = ReporteIncapacidad
