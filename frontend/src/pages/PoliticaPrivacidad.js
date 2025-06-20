import React from "react";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles.css";

function PoliticaPrivacidad() {
  return (
    <div className="politica-privacidad-page-container">
      <Navbar />
      <div className="politica-privacidad-content">
        <h1>Política de Privacidad de SaludPlus</h1>
        <ol>
          <h2>Información Recopilada</h2>
          <p>
            SaludPlus recopila información personal de los usuarios, incluyendo
            datos de identificación, historial médico y síntomas ingresados.
            Esta información es necesaria para proporcionar un diagnóstico
            adecuado.
          </p>
          <h2>Uso de la Información</h2>
          <p>
            La información recopilada se utilizará para:
            <ul>
              <li>Realizar diagnósticos y sugerencias médicas.</li>
              <li>Gestionar historiales clínicos y autorizaciones.</li>
              <li>Enviar notificaciones relevantes a los usuarios.</li>
            </ul>
          </p>
          <h2>Seguridad de los Datos</h2>
          <p>
            SaludPlus implementa medidas de seguridad para proteger la
            información personal de los usuarios. Los datos se transmiten de
            manera segura y se almacenan en servidores protegidos.
          </p>
          <h2>Compartición de Información</h2>
          <p>
            No compartiremos la información personal de los usuarios con
            terceros sin su consentimiento, excepto cuando sea requerido por la
            ley.
          </p>
          <h2>Derechos de los Usuarios</h2>
          <p>
            Los usuarios tienen derecho a acceder, corregir y eliminar su
            información personal. Pueden ejercer estos derechos contactando a
            nuestro equipo de soporte.
          </p>
          <h2>Cambios en la Política de Privacidad</h2>
          <p>
            SaludPlus se reserva el derecho de modificar esta Política de
            Privacidad. Los cambios serán notificados a los usuarios a través de
            la plataforma.
          </p>
          <h2>Contacto</h2>
          <p>
            Para cualquier pregunta o inquietud sobre esta Política de
            Privacidad, los usuarios pueden contactar a nuestro equipo de
            soporte a través de la plataforma.
          </p>
        </ol>
      </div>
      <Footer />
    </div>
  );
}

export default PoliticaPrivacidad;
