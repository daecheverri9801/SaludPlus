import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { NavbarMedico } from "../components/NavbarMedico";
import LoadingSpinner from "../components/LoadingSpinner";
import FooterMedico from "../components/FooterMedico";
import { useNavigate } from "react-router";

function Scheduler() {
  const { user, loading } = useAuth();
  const [citas, setCitas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const uid = user?.user_metadata?.uid || user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCitas = async () => {
      if (!user) return;

      try {
        const userID = { idauth: uid };

        const responseAuth = await fetch("http://localhost:3000/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userID),
        });

        if (!responseAuth.ok) {
          const errorText = await responseAuth.text();
          throw new Error("Error en la API del backend (auth): " + errorText);
        }

        const data = await responseAuth.json();
        const responseCitas = await fetch(
          `http://localhost:3000/api/cita-medica/medico/${data.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!responseCitas.ok) {
          const errorText = await responseCitas.text();
          throw new Error("Error en la API del backend (citas): " + errorText);
        }

        const dataCitas = await responseCitas.json();
        setCitas(dataCitas);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCitas();
  }, [uid]);

  const handleAtenderCita = (cita) => {
    navigate("/atencion", { state: { cita } });
  };

  const isAtenderEnabled = (fechaCita) => {
    if (!fechaCita) return false;

    const now = new Date();
    const citaDateTime = new Date(fechaCita);

    if (isNaN(citaDateTime.getTime())) return false;

    // Verificar si es el mismo día
    if (now.toDateString() !== citaDateTime.toDateString()) return false;

    // Diferencia en milisegundos
    const diff = now.getTime() - citaDateTime.getTime();
    const twentyMinutesInMs = 60 * 60 * 1000;

    // Habilitar si la hora actual es igual o hasta 20 minutos después de la cita
    return diff >= 0 && diff <= twentyMinutesInMs;
  };

  if (loading || isLoading) {
    return (
      <div>
        <NavbarMedico />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <NavbarMedico />
      <h1>Programador de Citas</h1>
      <table>
        <thead>
          <tr>
            <th>Fecha Cita</th>
            <th>Hora Cita</th>
            <th>Nombre Paciente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => {
            const citaDateTime = new Date(cita.fecha_cita);
            const fechaCitaFormateada =
              citaDateTime.toLocaleDateString("es-ES");
            const horaCitaFormateada = citaDateTime.toLocaleTimeString(
              "es-ES",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            return (
              <tr key={cita.id_cita}>
                <td>{fechaCitaFormateada}</td>
                <td>{horaCitaFormateada}</td>
                <td>{cita.nombre_paciente}</td>
                <td>
                  <button
                    onClick={() => handleAtenderCita(cita)}
                    disabled={!isAtenderEnabled(cita.fecha_cita)}
                  >
                    Atender Cita
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <FooterMedico />
    </div>
  );
}

export default Scheduler;
