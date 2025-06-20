const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { promises } = require('dns');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mauricioalzateocampo@gmail.com',
        pass: '1234'
    }
})

const generarPdfAutorizacionMedicamento = (datosAutorizacion) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const filePath = path.join(__dirname, '..', 'temp', `autorizacion_medicamento_${Date.now()}.pdf`)
        const stream = fs.createWriteStream(filePath)

        doc.pipe(stream)

        doc.fontSize(18).text('Autorización de Medicamento', { align: 'center' })
        doc.moveDown()

        doc.fontSize(12)
            .text(`Paciente: ${datosAutorizacion.nombrePaciente}`)
            .text(`Médico: ${datosAutorizacion.nombreMedico}`)
            .text(`Consulta Asociada: ${datosAutorizacion.idConsulta}`)
            .moveDown()
            .text(`Medicamento: ${datosAutorizacion.medicamento}`)
            .text(`Dosis: ${datosAutorizacion.dosis}`)
            .text(`Frecuencia: ${datosAutorizacion.frecuencia}`)
            .text(`Duración del Tratamiento: ${datosAutorizacion.duracion}`)
            .moveDown()
            .text(`Fecha de Emisión: ${datosAutorizacion.fechaEmision}`)
            .text(`Fecha de Expiración: ${datosAutorizacion.fechaExpiracion}`)
            .moveDown()
            .text(`Justificación: ${datosAutorizacion.justificacion}`)
            .moveDown()
            .text(`Estado de la Autorización: ${datosAutorizacion.estado}`)

        doc.end()

        stream.on('finish', () => {
            resolve(filePath);
        })

        stream.on('error', (err) => {
            reject(err)
        })
    })
}


const enviarPdfPorCorreo = async (emailDestino, pdfPath) => {
    const info = await transporter.sendMail({
        from: '"Sistema Médico" <TU_CORREO@gmail.com>',
        to: emailDestino,
        subject: 'Incapacidad Médica',
        text: 'Adjunto encontrará el documento de incapacidad médica.',
        attachments: [
            {
                filename: 'incapacidad_medica.pdf',
                path: pdfPath
            }
        ]
    })

    return info
}

module.exports = {
    generarPdfAutorizacionMedicamento,
    enviarPdfPorCorreo
}