import React from "react";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles.css";

function Terminos() {
  return (
    <div className="terminos-page-container">
      <Navbar />
      <div className="terminos-content">
        <h1>Términos de Servicio de SaludPlus</h1>
        <ol>
          <h2>Aceptación de los Términos</h2>
          <p>
            Al utilizar SaludPlus, aceptas cumplir con estos Términos de
            Servicio. Si no estás de acuerdo, no debes utilizar el servicio.
          </p>

          <h2>Descripción del Servicio</h2>
          <p>
            SaludPlus es un sistema de diagnóstico de enfermedades que utiliza
            inteligencia artificial para analizar datos de pacientes y sugerir
            posibles diagnósticos. El servicio incluye el registro de pacientes
            y médicos, así como la gestión de historiales clínicos y
            autorizaciones médicas.
          </p>
          <h2>Registro de Usuarios</h2>
          <p>
            Para acceder a ciertas funcionalidades, los usuarios deben
            registrarse proporcionando información personal, incluyendo nombre,
            cédula, correo electrónico y otros datos relevantes. Es
            responsabilidad del usuario mantener la confidencialidad de su
            información de acceso.
          </p>
          <h2>Uso de Datos</h2>
          <p>
            Los datos ingresados por los usuarios serán utilizados
            exclusivamente para el propósito de diagnóstico y gestión médica. No
            se compartirán con terceros sin el consentimiento explícito del
            usuario, salvo en cumplimiento de la ley.
          </p>
          <h2>Responsabilidad del Usuario</h2>
          <p>
            Los usuarios son responsables de la veracidad de la información
            proporcionada. SaludPlus no se hace responsable por diagnósticos
            erróneos derivados de información incorrecta o incompleta.
          </p>
          <h2>Modificaciones a los Términos</h2>
          <p>
            SaludPlus se reserva el derecho de modificar estos Términos de
            Servicio en cualquier momento. Los cambios serán notificados a los
            usuarios a través de la plataforma.
          </p>
          <h2>Legislación Aplicable</h2>
          <p>
            Estos Términos se rigen por las leyes de Colombia. Cualquier disputa
            será resuelta en los tribunales competentes de la jurisdicción.
          </p>
        </ol>
      </div>
      <Footer />
    </div>
  );
}

export default Terminos;
