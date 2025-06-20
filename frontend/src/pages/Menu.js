import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { client } from "../supabase/client";
import "../styles.css";
import medicalRecordIcon from "../assets/medical-record.png";
import disabilityIcon from "../assets/disability.png";
import medicationIcon from "../assets/medication.png";
import procedureIcon from "../assets/procedure.png";
import welcomeDoctor from "../assets/welcome-doctor.png";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";

function Menu() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const uid = user?.user_metadata?.uid || user?.id;

  console.log("User ID:", uid);

  const menuItems = [
    {
      id: 1,
      title: "Historial Clínico",
      icon: medicalRecordIcon,
      path: "/historial-clinico",
      description: "Acceda a su historial médico completo",
      color: "#0077cc",
    },
    {
      id: 2,
      title: "Incapacidades Médicas",
      icon: disabilityIcon,
      path: "/incapacidades",
      description: "Consulte y gestione sus incapacidades",
      color: "#00b4d8",
    },
    {
      id: 3,
      title: "Autorización Medicamentos",
      icon: medicationIcon,
      path: "/autorizacion-medicamentos",
      description: "Solicite autorizaciones para medicamentos",
      color: "#4caf50",
    },
    {
      id: 4,
      title: "Autorización Exámenes/Procedimientos",
      icon: procedureIcon,
      path: "/autorizacion-procedimientos",
      description: "Gestione autorizaciones de exámenes médicos",
      color: "#ff9800",
    },
  ];

  useEffect(() => {
  const fetchPaciente = async () => {
    if (!uid) return; // Salir si uid no está disponible

    try {
      const userID = { idauth: uid };
      
      // Primera llamada para obtener el ID del paciente
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
      console.log("Datos recibidos del backend (auth):", data.id);

      // Segunda llamada para obtener el historial del paciente
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
        throw new Error("Error en la API del backend (historial): " + errorText);
      }

      const historialData = await responseHistorial.json();
      console.log("Datos recibidos del backend (historial):", historialData);

    } catch (error) {
      console.error(error);
    }
  };

  fetchPaciente();
}, [uid]); // Dependencia de uid

  if (loading) {
    return (
      <div className="page-container">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="menu-page-container">
      <Navbar />
      <div className="menu-hero">
        <div className="menu-hero-content">
          <h1>
            Bienvenido,{" "}
            <span>
              {user.user_metadata?.nombre || user.email.split("@")[0]}
            </span>
          </h1>
          <p className="hero-subtitle">¿En qué podemos ayudarte hoy?</p>
          <div className="welcome-image-mobile">
            <img src={welcomeDoctor} alt="Médico sonriente" />
          </div>
        </div>
        <div className="welcome-image">
          <img src={welcomeDoctor} alt="Médico sonriente" />
        </div>
      </div>
      <div className="menu-main-container">
        <div className="menu-grid">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="menu-card"
              onClick={() => navigate(item.path)}
              style={{ "--card-color": item.color }}
            >
              <div className="menu-icon-container">
                <img src={item.icon} alt={item.title} className="menu-icon" />
              </div>
              <h3>{item.title}</h3>
              <p className="menu-description">{item.description}</p>
              <div className="menu-arrow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="quick-links-section">
        <h2>Accesos rápidos</h2>
        <div className="quick-links">
          <button onClick={() => navigate("/citas")}>Mis Citas</button>
          <button onClick={() => navigate("/autorizacion-medicamentos")}>Medicamentos</button>
          <button onClick={() => navigate("/autorizacion-procedimientos")}>Examenes</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Menu;
