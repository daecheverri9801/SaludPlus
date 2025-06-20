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

const generarPdfIncapacidad = (datosIncapacidad) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const filePath = path.join(__dirname, '..', 'temp', `incapacidad_${Date.now()}.pdf`)
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

        stream.on('error', (err) => {
            reject(err);
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
    generarPdfIncapacidad,
    enviarPdfPorCorreo
}