const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

class ExportarPDFIncapacidad {
  async exportar(datosIncapacidad) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument()
      const filePath = path.join(__dirname, '..', '..', '..', 'temp', `incapacidad_${Date.now()}.pdf`)
      const stream = fs.createWriteStream(filePath)

      doc.pipe(stream)

      doc.fontSize(18).text('Incapacidad Médica', { align: 'center' })
      doc.moveDown()

      doc.fontSize(12)
        .text(`Paciente: ${datosIncapacidad.nombrePaciente}`)
        .text(`Médico: ${datosIncapacidad.nombreMedico}`)
        .text(`Diagnóstico: ${datosIncapacidad.diagnostico}`)
        .text(`Fecha de Inicio: ${datosIncapacidad.fechaInicio}`)
        .text(`Fecha de Fin: ${datosIncapacidad.fechaFin}`)
        .text(`Días de Incapacidad: ${datosIncapacidad.diasIncapacidad}`)
        .moveDown()
        .text(`Recomendaciones: ${datosIncapacidad.recomendaciones}`)

      doc.end()

      stream.on('finish', () => {
        resolve(filePath);
      })

      stream.on('error', reject)
    })
  }
}

module.exports = ExportarPDFIncapacidad