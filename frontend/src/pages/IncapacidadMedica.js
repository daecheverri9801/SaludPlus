import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navbar } from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import Footer from "../components/Footer";
import jsPDF from "jspdf";

function IncapacidadMedica() {
  const { user, loading } = useAuth();
  const [incapacidades, setIncapacidades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const uid = user?.user_metadata?.uid || user?.id;

  useEffect(() => {
    const fetchIncapacidades = async () => {
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
        const responseIncapacidades = await fetch(
          `http://localhost:3000/api/incapacidades/${data.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!responseIncapacidades.ok) {
          const errorText = await responseIncapacidades.text();
          throw new Error(
            "Error en la API del backend (incapacidades): " + errorText
          );
        }
        const dataIncapacidades = await responseIncapacidades.json();

        // Obtener la fecha de consulta para cada incapacidad
        const incapacidadesConFechas = await Promise.all(
          dataIncapacidades.map(async (incapacidad) => {
            const consultaResponse = await fetch(
              `http://localhost:3000/api/historial/${data.id}/${incapacidad.id_consulta}`
            );
            if (!consultaResponse.ok) {
              throw new Error("Error al obtener la fecha de consulta");
            }
            const consultaData = await consultaResponse.json();
            return {
              ...incapacidad,
              fechaConsulta: consultaData[0]?.fecha_consulta,
            };
          })
        );
        setIncapacidades(incapacidadesConFechas);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncapacidades();
  }, [uid]);

  const handleGeneratePDF = (incapacidad) => {
    const doc = new jsPDF();
    const marginLeft = 15;
    let currentY = 20;

    doc.setFontSize(16);
    doc.text("Incapacidades Médicas", marginLeft, currentY);
    currentY += 10;

    doc.setFontSize(10);

    const fechaConsulta = new Date(incapacidad.fechaConsulta);
    const horaConsulta = fechaConsulta.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const fechaEmision = new Date(incapacidad.fecha_emision).toLocaleDateString("es-ES");
    const fechaInicio = new Date(incapacidad.fecha_inicio).toLocaleDateString("es-ES");
    const fechaFin = new Date(incapacidad.fecha_fin).toLocaleDateString("es-ES");

    const lineas = [
      `Fecha de Consulta: ${fechaConsulta.toLocaleDateString("es-ES")}`,
      `Hora de Consulta: ${horaConsulta}`,
      `Fecha de Emisión: ${fechaEmision}`,
      `Médico: ${incapacidad.nombre_medico}`,
      `Inicio de Incapacidad: ${fechaInicio}`,
      `Fin de Incapacidad: ${fechaFin}`,
      `Días de Incapacidad: ${incapacidad.dias_incapacidad}`,
      `Diagnóstico: ${incapacidad.diagnostico}`,
      `Recomendaciones: ${incapacidad.recomendaciones}`,
      `Estado: ${incapacidad.estado}`,
    ];

    lineas.forEach((linea) => {
      doc.text(linea, marginLeft, currentY);
      currentY += 7;
    });

    doc.save(`incapacidad_${incapacidad.id_incapacidad}.pdf`);
  };

  if (loading || isLoading) {
    return (
      <div>
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <h1>Incapacidades Médicas</h1>
      <table>
        <thead>
          <tr>
            <th>Fecha de Consulta</th>
            <th>Hora de Consulta</th>
            <th>Fecha de Emisión</th>
            <th>Médico</th>
            <th>Fecha de Inicio de Incapacidad</th>
            <th>Fecha de Fin de Incapacidad</th>
            <th>Días de Incapacidad</th>
            <th>Diagnóstico</th>
            <th>Recomendaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {incapacidades.map((incapacidad) => {
            const fechaFin = new Date(incapacidad.fecha_fin);
            const fechaActual = new Date();
            const isActive = fechaFin > fechaActual;

            const fechaConsulta = new Date(incapacidad.fechaConsulta);
            const fechaConsultaFormateada = fechaConsulta.toLocaleDateString("es-ES");
            const horaConsultaFormateada = fechaConsulta.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

            return (
              <tr key={incapacidad.id_incapacidad}>
                <td>{fechaConsultaFormateada}</td>
                <td>{horaConsultaFormateada}</td>
                <td>{new Date(incapacidad.fecha_emision).toLocaleDateString("es-ES")}</td>
                <td>{incapacidad.nombre_medico}</td>
                <td>{new Date(incapacidad.fecha_inicio).toLocaleDateString("es-ES")}</td>
                <td>{new Date(incapacidad.fecha_fin).toLocaleDateString("es-ES")}</td>
                <td>{incapacidad.dias_incapacidad}</td>
                <td>{incapacidad.diagnostico}</td>
                <td>{incapacidad.recomendaciones}</td>
                <td>
                  <button
                    onClick={() => handleGeneratePDF(incapacidad)}
                    // disabled={!isActive}
                  >
                    Generar PDF
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Footer />
    </div>
  );
}

export default IncapacidadMedica;