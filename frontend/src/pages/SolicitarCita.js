import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import "../components/SolicitarCita.css";
import { data } from "react-router-dom";

function SolicitarCita() {
  const { user, loading } = useAuth();
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");
  const [medicoSeleccionado, setMedicoSeleccionado] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [motivo, setMotivo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [idPaciente, setIdPaciente] = useState(null);
  const [citasPendientes, setCitasPendientes] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(false);

  // Obtener el UID del usuario autenticado
  const uid = user?.user_metadata?.uid || user?.id;

  // 1. Obtener el id del paciente autenticado
  useEffect(() => {
    const fetchPacienteId = async () => {
      if (!user) return;
      try {
        const responseAuth = await fetch("http://localhost:3000/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idauth: uid }),
        });
        if (!responseAuth.ok) throw new Error("Error autenticando usuario");
        const data = await responseAuth.json();
        setIdPaciente(data.id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPacienteId();
  }, [uid, user]);

  // 2. Obtener especialidades y médicos
  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/medicos");
        const data = await res.json();
        const especialidadesUnicas = [
          ...new Set(data.map((m) => m.especialidad)),
        ];
        setEspecialidades(especialidadesUnicas);
        setMedicos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedicos();
  }, []);

  // 3. Filtrar médicos por especialidad seleccionada
  const medicosFiltrados = medicos.filter(
    (m) => m.especialidad === especialidadSeleccionada
  );
  console.log("Médicos filtrados:", medicosFiltrados);

  // 4. Obtener disponibilidad cuando hay médico y fecha seleccionados
  useEffect(() => {
    if (medicoSeleccionado && fechaSeleccionada) {
      setIsLoading(true);
      // Aquí se usa el id del médico seleccionado
      fetch(
        `http://localhost:3000/api/cita-medica/disponibilidad/${medicoSeleccionado}/?fecha=${fechaSeleccionada}`
      )
        .then((res) => res.json())
        .then((data) => {
          setHorasDisponibles(data.disponibles || []);
        })
        .catch((err) => {
          setHorasDisponibles([]);
        })
        .finally(() => setIsLoading(false));
    } else {
      setHorasDisponibles([]);
    }
  }, [medicoSeleccionado, fechaSeleccionada]);

  // 5. Asignar cita
  const asignarCita = async (hora) => {
    if (!motivo) {
      alert("Por favor ingresa el motivo de la cita.");
      return;
    }
    if (!idPaciente) {
      alert("No se pudo identificar al paciente autenticado.");
      return;
    }
    setIsLoading(true);
    const fechaHora = `${fechaSeleccionada}T${hora}:00`;
    try {
      const res = await fetch("http://localhost:3000/api/cita-medica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_paciente: idPaciente,
          id_medico: parseInt(medicoSeleccionado),
          fecha_cita: fechaHora,
          motivo,
        }),
      });
      if (res.status === 201) {
        alert("¡Cita asignada exitosamente!");
        setHorasDisponibles(horasDisponibles.filter((h) => h !== hora));
        setMotivo("");
      } else {
        const data = await res.json();
        alert(data.mensaje || "Error al asignar la cita.");
      }
    } catch (err) {
      alert("Error de red al asignar la cita.");
    }
    setIsLoading(false);
  };

  const cancelarCita = async (idCita) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta cita?"))
      return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/cita-medica/${idCita}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setCitasPendientes((prev) =>
          prev.filter((cita) => cita.id_cita !== idCita)
        );
        alert("Cita cancelada exitosamente.");
      } else {
        alert("No se pudo cancelar la cita.");
      }
    } catch (err) {
      alert("Error de red al cancelar la cita.");
    }
  };

  useEffect(() => {
    if (!idPaciente) return;
    setLoadingCitas(true);
    fetch(`http://localhost:3000/api/cita-medica/paciente/${idPaciente}`)
      .then((res) => res.json())
      .then((data) => {
        // Filtrar solo las citas futuras
        const ahora = new Date();
        const futuras = data.filter((cita) => {
          // Asegúrate de que la fecha esté en formato compatible con Date
          const fechaCita = new Date(cita.fecha_cita.replace(" ", "T"));
          return fechaCita > ahora;
        });
        setCitasPendientes(futuras);
      })
      .catch(() => setCitasPendientes([]))
      .finally(() => setLoadingCitas(false));
  }, [idPaciente]);

  if (loading || isLoading) {
    return (
      <div>
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="solicitar-cita-bg">
      <Navbar />
      <div className="solicitar-cita-container">
        <h2>Solicitar Cita Médica</h2>
        <div className="solicitar-cita-form">
          <div className="form-row">
            <div className="form-group">
              <label>Especialidad</label>
              <select
                value={especialidadSeleccionada}
                onChange={(e) => {
                  setEspecialidadSeleccionada(e.target.value);
                  setMedicoSeleccionado("");
                  setHorasDisponibles([]);
                }}
              >
                <option value="">Seleccione...</option>
                {especialidades.map((esp, idx) => (
                  <option key={idx} value={esp}>
                    {esp}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Médico</label>
              <select
                value={medicoSeleccionado}
                onChange={(e) => {
                  setMedicoSeleccionado(e.target.value);
                  setHorasDisponibles([]);
                }}
                disabled={!especialidadSeleccionada}
              >
                <option value="">Seleccione...</option>
                {medicosFiltrados.map((med) => (
                  <option key={med.id_medico} value={med.id_medico}>
                    {med.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Motivo de la cita</label>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Describe el motivo"
              />
            </div>
          </div>
        </div>
        <div className="solicitar-cita-bottom">
          <div className="calendario-container">
            <label>Selecciona una fecha:</label>
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              disabled={!medicoSeleccionado}
            />
          </div>
          <div className="horas-disponibles-container">
            <h4>Horas disponibles</h4>
            {isLoading ? (
              <p>Cargando...</p>
            ) : horasDisponibles.length === 0 ? (
              <p>No hay horas disponibles para este día.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {horasDisponibles.map((hora, idx) => (
                    <tr key={idx}>
                      <td>{hora}</td>
                      <td>
                        <button
                          onClick={() => asignarCita(hora)}
                          disabled={isLoading}
                        >
                          Solicitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <div className="citas-pendientes-container" style={{ marginTop: "2rem" }}>
        <h4>Citas pendientes</h4>
        {loadingCitas ? (
          <p>Cargando citas...</p>
        ) : citasPendientes.length === 0 ? (
          <p>No tienes citas pendientes.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Médico</th>
                <th>Especialidad</th>
                <th>Motivo</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {citasPendientes.map((cita, idx) => {
                const fechaObj = new Date(cita.fecha_cita.replace(" ", "T"));
                const fecha = fechaObj.toLocaleDateString("es-ES");
                const hora = fechaObj.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <tr key={idx}>
                    <td>{fecha}</td>
                    <td>{hora}</td>
                    <td>{cita.nombre_medico || cita.medico || "N/A"}</td>
                    <td>{cita.especialidad || "N/A"}</td>
                    <td>{cita.motivo}</td>
                    <td>
                      <button
                        style={{
                          background: "#e74c3c",
                          color: "#fff",
                          border: "none",
                          padding: "0.3rem 0.7rem",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => cancelarCita(cita.id_cita)}
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default SolicitarCita;
