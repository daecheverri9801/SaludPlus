import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NavbarMedico } from "../components/NavbarMedico";
import { useNavigate } from "react-router-dom";
import FooterMedico from "../components/FooterMedico";
import "../components//Remision.css";

function Remision() {
  const { state } = useLocation();
  const { formData, respuestaIA, cita } = state || {};

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [ids, setIds] = useState({
    id_paciente: cita?.id_paciente || "",
    id_medico: cita?.id_medico || "",
    id_cita: cita?.id_cita || "",
  });

  const idCitaSeleccionada = ids.id_cita;

  // Parse de la respuesta de la IA
  let diagnosticoData = {};
  try {
    diagnosticoData = JSON.parse(respuestaIA);
  } catch (error) {
    console.error("Error parsing respuesta IA:", error);
  }

  // Estados para datos editables
  const [datosAdicionales, setDatosAdicionales] = useState({
    observaciones: "",
    descripcion: "",
  });

  const [incapacidad, setIncapacidad] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    diagnostico: diagnosticoData.diagnosticos?.condicion || "",
    recomendaciones:
      diagnosticoData.diagnosticos?.recomendacion?.incapacidad || "",
  });

  const [medicamentos, setMedicamentos] = useState(
    diagnosticoData.diagnosticos?.recomendacion?.medicamentos?.map((med) => ({
      medicamento: med.nombre,
      dosis: med.dosis || med.docis,
      frecuencia: med.frecuencia,
      duracion: "",
      fecha_expiracion: "",
      justificacion: "",
      estado: "pendiente",
    })) || []
  );

  const [examenes, setExamenes] = useState([]);

  const citaDateTime = new Date(cita?.fecha_cita);
  const fechaCita = citaDateTime.toLocaleDateString("es-ES");
  const horaCita = citaDateTime.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const tabs = [
    "Datos Básicos",
    "Diagnóstico Generado",
    "Datos Adicionales",
    "Incapacidad Médica",
    "Medicamentos",
    "Exámenes",
  ];

  const calcularFechaExpiracion = (duracion) => {
    if (!duracion) return "";
    const hoy = new Date();
    const diasDuracion = parseInt(duracion);
    const fechaExpiracion = new Date(
      hoy.getTime() + diasDuracion * 24 * 60 * 60 * 1000
    );
    return fechaExpiracion.toISOString().split("T")[0];
  };

  const handleMedicamentoChange = (index, field, value) => {
    const newMedicamentos = [...medicamentos];
    newMedicamentos[index][field] = value;

    if (field === "duracion") {
      newMedicamentos[index].fecha_expiracion = calcularFechaExpiracion(value);
    }

    setMedicamentos(newMedicamentos);
  };

  const addExamen = () => {
    setExamenes([
      ...examenes,
      {
        tipo: "",
        descripcion: "",
        fecha_expiracion: "",
        instrucciones: "",
        estado: "pendiente",
      },
    ]);
  };

  function formatPostgresTimestamp(dateString) {
    const date = new Date(dateString);
    // Obtén los componentes
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    const ms = String(date.getMilliseconds()).padStart(5, "0"); // 5 dígitos para microsegundos
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}.${ms}`;
  }

  const removeExamen = (index) => {
    setExamenes(examenes.filter((_, i) => i !== index));
  };

  const handleExamenChange = (index, field, value) => {
    const newExamenes = [...examenes];
    newExamenes[index][field] = value;
    setExamenes(newExamenes);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Formatea la fecha y hora de la cita seleccionada
      const fechaConsulta = formatPostgresTimestamp(cita.fecha_cita);

      // 1. Crear Historial Clínico
      const historialBody = {
        idPaciente: parseInt(ids.id_paciente),
        idMedico: parseInt(ids.id_medico),
        motivo: formData.sintomas,
        observaciones: datosAdicionales.observaciones,
        codigo_icd: diagnosticoData.diagnosticos?.codigo_icd || "",
        descripcion: datosAdicionales.descripcion,
        tratamiento: diagnosticoData.diagnosticos?.recomendacion?.medicamentos
          ? diagnosticoData.diagnosticos.recomendacion.medicamentos
              .map(
                (med) =>
                  `${med.nombre} ${med.dosis || med.docis} ${med.frecuencia}`
              )
              .join("; ")
          : "",
        fecha_consulta: fechaConsulta, // Usa la fecha y hora de la cita
      };

      const historialRes = await fetch("http://localhost:3000/api/historial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(historialBody),
      });

      if (!historialRes.ok) throw new Error("Error al crear historial clínico");
      const historialData = await historialRes.json();

      // 2. Crear Incapacidad Médica (usar id_cita de la pestaña 1)
      if (
        incapacidad.fecha_inicio &&
        incapacidad.fecha_fin &&
        incapacidad.diagnostico
      ) {
        const incapacidadBody = {
          idPaciente: parseInt(ids.id_paciente),
          idMedico: parseInt(ids.id_medico),
          idConsulta: parseInt(idCitaSeleccionada), // id_cita de la pestaña 1
          fechaInicio: incapacidad.fecha_inicio,
          fechaFin: incapacidad.fecha_fin,
          diagnostico: incapacidad.diagnostico,
          recomendaciones: incapacidad.recomendaciones,
        };

        const incapacidadRes = await fetch(
          "http://localhost:3000/api/incapacidades",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(incapacidadBody),
          }
        );

        if (!incapacidadRes.ok)
          throw new Error("Error al crear incapacidad médica");
      }

      // 3. Crear Autorizaciones de Medicamentos (usar id_cita de la pestaña 1)
      for (const med of medicamentos) {
        if (!med.medicamento) continue;
        const medicamentoBody = {
          id_paciente: parseInt(ids.id_paciente),
          id_medico: parseInt(ids.id_medico),
          id_consulta: parseInt(idCitaSeleccionada), // id_cita de la pestaña 1
          medicamento: med.medicamento,
          dosis: med.dosis,
          frecuencia: med.frecuencia,
          duracion: med.duracion ? `${med.duracion} días` : "",
          fecha_expiracion: med.fecha_expiracion,
          justificacion: med.justificacion,
          estado: med.estado,
        };

        const medRes = await fetch(
          "http://localhost:3000/api/autorizacion-medicamentos",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(medicamentoBody),
          }
        );

        if (!medRes.ok)
          throw new Error("Error al crear autorización de medicamento");
      }

      // 4. Crear Autorizaciones de Exámenes (usar id_cita de la pestaña 1)
      for (const ex of examenes) {
        if (!ex.tipo) continue;
        const examenBody = {
          id_paciente: parseInt(ids.id_paciente),
          id_medico: parseInt(ids.id_medico),
          id_consulta: parseInt(idCitaSeleccionada), // id_cita de la pestaña 1
          tipo: ex.tipo,
          descripcion: ex.descripcion,
          fecha_expiracion: ex.fecha_expiracion,
          instrucciones: ex.instrucciones,
          estado: ex.estado,
        };

        const exRes = await fetch(
          "http://localhost:3000/api/autorizacion-procedimiento-examen",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(examenBody),
          }
        );

        if (!exRes.ok) throw new Error("Error al crear autorización de examen");
      }

      alert("Remisión finalizada y registrada correctamente.");
      setDatosAdicionales({ observaciones: "", descripcion: "" });
      setIncapacidad({
        fecha_inicio: "",
        fecha_fin: "",
        diagnostico: "",
        recomendaciones: "",
      });
      setMedicamentos([]);
      setExamenes([]);
      navigate("/scheduler");
    } catch (error) {
      console.error("Error completo:", error);
      alert("Ocurrió un error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!formData || !cita) {
    return (
      <div>
        <NavbarMedico />
        <h2>No hay datos disponibles para la remisión.</h2>
        <FooterMedico />
      </div>
    );
  }

  return (
    <div>
      <NavbarMedico />
      <div className="remision-container">
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "#0369a1",
          }}
        >
          Remisión Médica
        </h2>

        <div className="remision-header">
          <strong>Paciente:</strong> {cita.nombre_paciente} |
          <strong> Fecha:</strong> {fechaCita} |<strong> Hora:</strong>{" "}
          {horaCita}
        </div>

        {/* Tabs Navigation */}
        <div className="tabs-navigation">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`tab-button ${activeTab === index ? "active" : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Pestaña 1: Datos Básicos */}
          <div className={`tab-panel ${activeTab === 0 ? "active" : ""}`}>
            <div className="form-row">
              <div className="form-group">
                <label>ID Paciente</label>
                <input type="text" value={ids.id_paciente} readOnly />
              </div>
              <div className="form-group">
                <label>ID Médico</label>
                <input type="text" value={ids.id_medico} readOnly />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>ID Cita</label>
                <input type="text" value={ids.id_cita} readOnly />
              </div>
              <div className="form-group">
                <label>Nombre del Paciente</label>
                <input type="text" value={formData.nombre_paciente} readOnly />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Fecha Cita</label>
                <input type="text" value={fechaCita} readOnly />
              </div>
              <div className="form-group">
                <label>Hora Cita</label>
                <input type="text" value={horaCita} readOnly />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Edad</label>
                <input type="text" value={formData.edad} readOnly />
              </div>
              <div className="form-group">
                <label>Sexo</label>
                <input type="text" value={formData.sexo} readOnly />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Peso</label>
                <input type="text" value={formData.peso + " kg"} readOnly />
              </div>
              <div className="form-group">
                <label>Ocupación</label>
                <input type="text" value={formData.ocupacion} readOnly />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Síntomas</label>
              <textarea value={formData.sintomas} readOnly rows={4} />
            </div>
          </div>

          {/* Pestaña 2: Diagnóstico Generado */}
          <div className={`tab-panel ${activeTab === 1 ? "active" : ""}`}>
            <div className="form-group">
              <label>Condición</label>
              <input
                type="text"
                value={diagnosticoData.diagnosticos?.condicion || ""}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Síntomas Identificados</label>
              <textarea
                value={diagnosticoData.diagnosticos?.sintomas?.join(", ") || ""}
                readOnly
                rows={4}
              />
            </div>
          </div>

          {/* Pestaña 3: Datos Adicionales */}
          <div className={`tab-panel ${activeTab === 2 ? "active" : ""}`}>
            <div className="form-group">
              <label>Observaciones</label>
              <textarea
                value={datosAdicionales.observaciones}
                onChange={(e) =>
                  setDatosAdicionales({
                    ...datosAdicionales,
                    observaciones: e.target.value,
                  })
                }
                rows={4}
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={datosAdicionales.descripcion}
                onChange={(e) =>
                  setDatosAdicionales({
                    ...datosAdicionales,
                    descripcion: e.target.value,
                  })
                }
                rows={4}
              />
            </div>
          </div>

          {/* Pestaña 4: Incapacidad Médica */}
          <div className={`tab-panel ${activeTab === 3 ? "active" : ""}`}>
            <div className="form-row">
              <div className="form-group">
                <label>Fecha de Inicio</label>
                <input
                  type="date"
                  value={incapacidad.fecha_inicio}
                  onChange={(e) =>
                    setIncapacidad({
                      ...incapacidad,
                      fecha_inicio: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Fecha de Fin</label>
                <input
                  type="date"
                  value={incapacidad.fecha_fin}
                  onChange={(e) =>
                    setIncapacidad({
                      ...incapacidad,
                      fecha_fin: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <label>Diagnóstico</label>
              <textarea
                value={incapacidad.diagnostico}
                onChange={(e) =>
                  setIncapacidad({
                    ...incapacidad,
                    diagnostico: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Recomendaciones</label>
              <textarea
                value={incapacidad.recomendaciones}
                onChange={(e) =>
                  setIncapacidad({
                    ...incapacidad,
                    recomendaciones: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
          </div>

          {/* Pestaña 5: Medicamentos */}
          <div className={`tab-panel ${activeTab === 4 ? "active" : ""}`}>
            {medicamentos.map((med, index) => (
              <div key={index} className="medicamento-item">
                <div className="medicamento-header">
                  Medicamento {index + 1}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Medicamento</label>
                    <input type="text" value={med.medicamento} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Dosis</label>
                    <input type="text" value={med.dosis} readOnly />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Frecuencia</label>
                    <input type="text" value={med.frecuencia} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Duración (días)</label>
                    <input
                      type="number"
                      value={med.duracion}
                      onChange={(e) =>
                        handleMedicamentoChange(
                          index,
                          "duracion",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha Expiración</label>
                    <input type="date" value={med.fecha_expiracion} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <select
                      value={med.estado}
                      onChange={(e) =>
                        handleMedicamentoChange(index, "estado", e.target.value)
                      }
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="aprobado">Aprobado</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Justificación</label>
                  <textarea
                    value={med.justificacion}
                    onChange={(e) =>
                      handleMedicamentoChange(
                        index,
                        "justificacion",
                        e.target.value
                      )
                    }
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pestaña 6: Exámenes */}
          <div className={`tab-panel ${activeTab === 5 ? "active" : ""}`}>
            <button className="add-button" onClick={addExamen}>
              + Agregar Examen
            </button>
            {examenes.map((examen, index) => (
              <div key={index} className="examen-item">
                <div className="examen-header">
                  Examen {index + 1}
                  <button
                    className="remove-button"
                    onClick={() => removeExamen(index)}
                  >
                    Eliminar
                  </button>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo</label>
                    <input
                      type="text"
                      value={examen.tipo}
                      onChange={(e) =>
                        handleExamenChange(index, "tipo", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha Expiración</label>
                    <input
                      type="date"
                      value={examen.fecha_expiracion}
                      onChange={(e) =>
                        handleExamenChange(
                          index,
                          "fecha_expiracion",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={examen.descripcion}
                    onChange={(e) =>
                      handleExamenChange(index, "descripcion", e.target.value)
                    }
                    rows={2}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Instrucciones</label>
                    <textarea
                      value={examen.instrucciones}
                      onChange={(e) =>
                        handleExamenChange(
                          index,
                          "instrucciones",
                          e.target.value
                        )
                      }
                      rows={2}
                    />
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <select
                      value={examen.estado}
                      onChange={(e) =>
                        handleExamenChange(index, "estado", e.target.value)
                      }
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="aprobado">Aprobado</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Section */}
        <div className="submit-section">
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Finalizar Remisión"}
          </button>
        </div>
      </div>
      <FooterMedico />
    </div>
  );
}

export default Remision;
