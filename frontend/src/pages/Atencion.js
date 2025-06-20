import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarMedico } from "../components/NavbarMedico";
import FooterMedico from "../components/FooterMedico";
import "../components/AtencionForm.css"; // Asegúrate de tener un archivo CSS para estilos personalizados

const estadosCiviles = [
  "Soltero/a",
  "Casado/a",
  "Divorciado/a",
  "Viudo/a",
  "Unión libre",
  "Separado/a",
];

const actividadFisica = ["Frecuentemente", "Algunas Veces", "Nunca"];

function Atencion() {
  const { state } = useLocation();
  const cita = state?.cita;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    sintomas: "",
    id_paciente: cita?.id_paciente || "",
    nombre_paciente: cita?.nombre_paciente || "",
    edad: "",
    sexo: "",
    Act_Fisica: "",
    peso: "",
    estado_civil: "",
    ocupacion: "",
  });

  const [loading, setLoading] = useState(false);
  const [respuestaIA, setRespuestaIA] = useState("");
  const [showRespuesta, setShowRespuesta] = useState(false);

  if (!cita) {
    return (
      <div>
        <NavbarMedico />
        <h2>No hay datos de la cita seleccionada.</h2>
        <FooterMedico />
      </div>
    );
  }

  const citaDateTime = new Date(cita.fecha_cita);
  const fechaCita = citaDateTime.toLocaleDateString("es-ES");
  const horaCita = citaDateTime.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const llamarIA = async () => {
    setLoading(true);
    setRespuestaIA("");
    setShowRespuesta(false);

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Error en la API: " + errorText);
      }

      const data = await response.json();
      setRespuestaIA(data.response || JSON.stringify(data, null, 2));
      setShowRespuesta(true);
    } catch (error) {
      setRespuestaIA("Error: " + error.message);
      setShowRespuesta(true);
    } finally {
      setLoading(false);
    }
  };

  const renderRespuestaFormateada = (respuesta) => {
    try {
      const data = JSON.parse(respuesta);

      return (
        <div className="respuesta-formateada">
          {/* Información del Paciente */}
          <div className="paciente-info">
            <h3>👤 Información del Paciente</h3>
            <p>
              <strong>ID:</strong> {data.paciente?.id}
            </p>
            <p>
              <strong>Nombre:</strong> {data.paciente?.nombre}
            </p>
            <p>
              <strong>Edad:</strong> {data.paciente?.años} años
            </p>
            <p>
              <strong>Género:</strong> {data.paciente?.genero}
            </p>
          </div>

          {/* Diagnóstico */}
          <div className="diagnostico-section">
            <h3>🩺 Diagnóstico</h3>

            <div className="condicion">
              <strong>Condición:</strong> {data.diagnosticos?.condicion}
            </div>

            {data.diagnosticos?.sintomas && (
              <div className="sintomas-list">
                <h4>📋 Síntomas Identificados:</h4>
                <ul>
                  {data.diagnosticos.sintomas.map((sintoma, index) => (
                    <li key={index}>{sintoma}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recomendaciones */}
            <div className="recomendaciones">
              <h4>💊 Tratamiento y Recomendaciones</h4>

              {data.diagnosticos?.recomendacion?.medicamentos && (
                <div className="medicamentos">
                  <strong>Medicamentos:</strong>
                  {data.diagnosticos.recomendacion.medicamentos.map(
                    (med, index) => (
                      <div key={index} className="medicamento-item">
                        <div className="medicamento-nombre">{med.nombre}</div>
                        <div className="medicamento-detalles">
                          Dosis: {med.dosis || med.docis} - Frecuencia:{" "}
                          {med.frecuencia}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {data.diagnosticos?.recomendacion?.incapacidad && (
                <div className="incapacidad">
                  <strong>⏰ Incapacidad:</strong>{" "}
                  {data.diagnosticos.recomendacion.incapacidad}
                </div>
              )}
            </div>

            <div className="fecha-diagnostico">
              Fecha del diagnóstico: {new Date().toISOString().split("T")[0]}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div className="error-json">
          <strong>Error al procesar la respuesta:</strong>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: "0.5rem" }}>
            {respuesta}
          </pre>
        </div>
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await llamarIA();
  };

  const handleAceptar = () => {
    navigate("/remision", {
      state: {
        formData: form,
        respuestaIA: respuestaIA,
        cita: cita,
      },
    });
  };

  const handleRechazar = async () => {
    await llamarIA();
  };

  return (
    <div>
      <NavbarMedico />
      <div className="atencion-container">
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "#0369a1",
          }}
        >
          Atención al Paciente
        </h2>
        <div className="atencion-header">
          <strong>Nombre Paciente:</strong> {cita.nombre_paciente} <br />
          <strong>Fecha Cita:</strong> {fechaCita} <br />
          <strong>Hora Cita:</strong> {horaCita}
        </div>

        <form className="atencion-form" onSubmit={handleSubmit}>
          <div>
            <label>Síntomas:</label>
            <br />
            <textarea
              name="sintomas"
              value={form.sintomas}
              onChange={handleChange}
              required
              rows={3}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label>Nombre Paciente:</label>
            <br />
            <input
              name="nombre_paciente"
              value={form.nombre_paciente}
              readonly
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label>Edad:</label>
            <br />
            <input
              name="edad"
              type="number"
              value={form.edad}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label>Sexo:</label>
            <br />
            <select
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            >
              <option value="">Seleccione</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label>Actividad Física:</label>
            <br />
            <select
              name="Act_Fisica"
              value={form.Act_Fisica}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            >
              <option value="">Seleccione</option>
              {actividadFisica.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Peso (kg):</label>
            <br />
            <input
              name="peso"
              type="number"
              value={form.peso}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label>Estado Civil:</label>
            <br />
            <select
              name="estado_civil"
              value={form.estado_civil}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            >
              <option value="">Seleccione</option>
              {estadosCiviles.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Ocupación:</label>
            <br />
            <input
              name="ocupacion"
              value={form.ocupacion}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Generando diagnóstico..." : "Enviar datos"}
          </button>
        </form>

        {showRespuesta && (
          <div className="respuesta-ia-section">
            <label>📋 Diagnóstico Generado:</label>
            {renderRespuestaFormateada(respuestaIA)}
            <div className="respuesta-ia-buttons">
              <button onClick={handleAceptar} disabled={loading}>
                ✅ Aceptar respuesta
              </button>
              <button onClick={handleRechazar} disabled={loading}>
                🔄 Rechazar y generar otra
              </button>
            </div>
          </div>
        )}
      </div>
      <FooterMedico />
    </div>
  );
}

export default Atencion;
