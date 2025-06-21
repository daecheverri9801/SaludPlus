class ReporteService {
  constructor(reporte, estrategia) {
    this.reporte = reporte
    this.estrategia = estrategia
  }

  async generar() {
    const datos = this.reporte.obtenerDatos()
    console.log("Datos para el PDF:", datos)
    return await this.estrategia.exportar(datos)
  }
}

module.exports = ReporteService
