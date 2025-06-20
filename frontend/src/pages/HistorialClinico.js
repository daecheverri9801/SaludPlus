import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navbar } from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import Footer from "../components/Footer";

function HistorialClinico() {
  const { user, loading } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const uid = user?.user_metadata?.uid || user?.id;

  useEffect(() => {
    const fetchHistorial = async () => {
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
        const responseHistorial = await fetch(
          `http://localhost:3000/api/historial/${data.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!responseHistorial.ok) {
          const errorText = await responseHistorial.text();
          throw new Error(
            "Error en la API del backend (historial): " + errorText
          );
        }
        const dataHistorial = await responseHistorial.json();
        console.log("Historial recibido:", dataHistorial);
        setHistorial(dataHistorial);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistorial();
  }, [uid]);

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
      <h1>Historial Clínico</h1>
      <table>
        <thead>
          <tr>
            <th>Fecha de Consulta</th>
            <th>Hora de Consulta</th>
            <th>Motivo</th>
            <th>Observaciones</th>
            <th>Descripción</th>
            <th>Tratamiento</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(historial) ? (
            historial.map((consulta) => (
              <tr key={consulta.id}>
                <td>
                  {new Date(consulta.fecha_consulta).toLocaleDateString()}
                </td>
                <td>
                  {new Date(consulta.fecha_consulta).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>{consulta.motivo}</td>
                <td>{consulta.observaciones}</td>
                <td>{consulta.descripcion}</td>
                <td>{consulta.tratamiento}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay historial disponible.</td>
            </tr>
          )}
        </tbody>
      </table>
      <Footer />
    </div>
  );
}

export default HistorialClinico;
