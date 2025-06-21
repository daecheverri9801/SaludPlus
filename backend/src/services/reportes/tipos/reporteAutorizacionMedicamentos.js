class ReporteAutorizacionMedicamentos {
  constructor(datos) {
    this.datos = datos
  }

  obtenerDatos() {
    console.log("desde Reporte", this.datos)
    
    return {
      nombre_paciente: this.datos.nombre_paciente || 'Paciente desconocido',
      nombre_medico: this.datos.nombre_medico || 'Médico desconocido',
      id_consulta: this.datos.id_consulta || 'Sin consulta',

      medicamento: this.datos.medicamento || 'No especificado',
      dosis: this.datos.dosis || 'No especificada',
      frecuencia: this.datos.frecuencia || 'No especificada',
      duracion: this.datos.duracion || 'No especificada',

      fecha_emision: new Date(this.datos.fecha_emision).toLocaleDateString('es-CO'),
      fecha_expiracion: new Date(this.datos.fecha_expiracion).toLocaleDateString('es-CO'),

      justificacion: this.datos.justificacion || 'Sin justificación',
      estado: this.datos.estado || 'pendiente'
    }
  }
}

module.exports = ReporteAutorizacionMedicamentos