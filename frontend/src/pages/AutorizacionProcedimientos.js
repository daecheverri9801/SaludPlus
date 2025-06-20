import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navbar } from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import Footer from "../components/Footer";
import jsPDF from "jspdf";

function AutorizacionProcedimientos() {
  const { user, loading } = useAuth();
  const [autorizaciones, setAutorizaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const uid = user?.user_metadata?.uid || user?.id;

  useEffect(() => {
    const fetchAutorizaciones = async () => {
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
        const responseAutorizaciones = await fetch(
          `http://localhost:3000/api/autorizacion-procedimiento-examen/${data.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!responseAutorizaciones.ok) {
          const errorText = await responseAutorizaciones.text();
          throw new Error(
            "Error en la API del backend (autorizaciones): " + errorText
          );
        }

        const dataAutorizaciones = await responseAutorizaciones.json();
        setAutorizaciones(dataAutorizaciones);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAutorizaciones();
  }, [uid]);

  const handleGeneratePDF = (autorizacion) => {
    const doc = new jsPDF();
    const marginLeft = 15;
    let currentY = 20;

    doc.setFontSize(16);
    doc.text("Autorización de Procedimiento/Examen", marginLeft, currentY);
    currentY += 10;

    doc.setFontSize(10);

    const lineas = [
      `Médico: ${autorizacion.nombre_medico}`,
      `Fecha de Emisión: ${new Date(
        autorizacion.fecha_emision
      ).toLocaleDateString("es-ES")}`,
      `Fecha de Expiración: ${new Date(
        autorizacion.fecha_expiracion
      ).toLocaleDateString("es-ES")}`,
      `Procedimiento/Examen: ${autorizacion.tipo}`,
      `Descripcion: ${autorizacion.descripcion}`,
      `Instrucciones: ${autorizacion.instrucciones}`,
      `Estado: ${autorizacion.estado}`,
    ];

    lineas.forEach((linea) => {
      doc.text(linea, marginLeft, currentY);
      currentY += 7;
    });

    doc.save(`autorizacion_procedimiento_${autorizacion.id_autorizacion}.pdf`);
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
      <h1>Autorizaciones de Procedimientos/Exámenes</h1>
      <table>
        <thead>
          <tr>
            <th>Médico</th>
            <th>Fecha de Emisión</th>
            <th>Fecha de Expiración</th>
            <th>Procedimiento/Examen</th>
            <th>Descripcion</th>
            <th>Instrucciones</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {autorizaciones.map((autorizacion) => (
            <tr key={autorizacion.id_autorizacion}>
              <td>{autorizacion.nombre_medico}</td>
              <td>
                {new Date(autorizacion.fecha_emision).toLocaleDateString(
                  "es-ES"
                )}
              </td>
              <td>
                {new Date(autorizacion.fecha_expiracion).toLocaleDateString(
                  "es-ES"
                )}
              </td>
              <td>{autorizacion.tipo}</td>
              <td>{autorizacion.descripcion}</td>
              <td>{autorizacion.instrucciones}</td>
              <td>{autorizacion.estado}</td>
              <td>
                <button onClick={() => handleGeneratePDF(autorizacion)}>
                  Generar PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Footer />
    </div>
  );
}

export default AutorizacionProcedimientos;
