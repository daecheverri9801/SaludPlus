const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class ExportarPDFAutorizacionMedicamentos {
  async exportar(datosAutorizacionMedicamentos) {
    console.log("datos desde la estrategia", datosAutorizacionMedicamentos)
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const filePath = path.join(__dirname, '..', '..', '..', 'temp', `incapacidad_${Date.now()}.pdf`);
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      doc.fontSize(18).text('Autorizacion Médicamentos', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12)
            .text(`Paciente: ${datosAutorizacionMedicamentos.nombre_paciente}`)
            .text(`Médico: ${datosAutorizacionMedicamentos.nombre_medico}`)
            .text(`Consulta Asociada: ${datosAutorizacionMedicamentos.id_consulta}`)
            .moveDown()
            .text(`Medicamento: ${datosAutorizacionMedicamentos.medicamento}`)
            .text(`Dosis: ${datosAutorizacionMedicamentos.dosis}`)
            .text(`Frecuencia: ${datosAutorizacionMedicamentos.frecuencia}`)
            .text(`Duración del Tratamiento: ${datosAutorizacionMedicamentos.duracion}`)
            .moveDown()
            .text(`Fecha de Emisión: ${datosAutorizacionMedicamentos.fecha_emision}`)
            .text(`Fecha de Expiración: ${datosAutorizacionMedicamentos.fecha_expiracion}`)
            .moveDown()
            .text(`Justificación: ${datosAutorizacionMedicamentos.justificacion}`)
            .moveDown()
            .text(`Estado de la Autorización: ${datosAutorizacionMedicamentos.estado}`)

      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });

      stream.on('error', reject);
    });
  }
}

module.exports = ExportarPDFAutorizacionMedicamentos;
