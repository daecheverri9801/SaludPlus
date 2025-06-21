class ReporteAutorizacionProcedimiento {
  constructor(datos) {
    this.datos = datos
  }

  obtenerDatos() {
    return {
      nombre_paciente: this.datos.nombre_paciente,
      nombre_medico: this.datos.nombre_medico,
      tipo: this.datos.tipo,
      fecha_emision: this.datos.fecha_emision,
      fecha_expiracion: this.fecha_expiracion || 'Tipo no especificado',
      instrucciones: this.datos.instrucciones || 'Sin descripción',
      descripcion: this.datos.descripcion
    }
  }
}

module.exports = ReporteAutorizacionProcedimiento