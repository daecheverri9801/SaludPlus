const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

class ExportarPDFAutorizacionProcedimiento {
  async exportar(datosAutorizacionProcedimiento) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument()
      const filePath = path.join(__dirname, '..', '..', '..', 'temp', `incapacidad_${Date.now()}.pdf`)
      const stream = fs.createWriteStream(filePath)

      doc.pipe(stream)

      doc.fontSize(18).text('Autorizacion Procedimiento', { align: 'center' })
      doc.moveDown()

      doc.fontSize(12)
            .text(`Paciente: ${datosAutorizacionProcedimiento.nombre_paciente}`)
            .text(`Médico: ${datosAutorizacionProcedimiento.nombre_medico}`)
            .text(`Tipo: ${datosAutorizacionProcedimiento.tipo}`)
            .text(`Fecha de Inicio: ${datosAutorizacionProcedimiento.fecha_emision}`)
            .text(`Fecha de Fin: ${datosAutorizacionProcedimiento.fecha_expiracion}`)
            .text(`Instrucciones: ${datosAutorizacionProcedimiento.instrucciones}`)
            .moveDown()
            .text(`Descripcion: ${datosAutorizacionProcedimiento.descripcion}`)

      doc.end()

      stream.on('finish', () => {
        resolve(filePath)
      })

      stream.on('error', reject)
    })
  }
}

module.exports = ExportarPDFAutorizacionProcedimiento