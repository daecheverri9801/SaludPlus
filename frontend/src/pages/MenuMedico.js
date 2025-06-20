import { NavbarMedico } from "../components/NavbarMedico";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { client } from "../supabase/client";
import "../styles.css";
import schedulerIcon from "../assets/scheduler.png"; // Asegúrate de que la imagen esté disponible
import attentionIcon from "../assets/attention.png"; // Asegúrate de que la imagen esté disponible
import procedureIcon from "../assets/procedure.png"; // Asegúrate de que la imagen esté disponible
import medicationIcon from "../assets/medication.png"; // Asegúrate de que la imagen esté disponible
import welcomeDoctor from "../assets/welcome-doctor.png";
import FooterMedico from "../components/FooterMedico";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";

function MenuMedico() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const menuItems = [
    {
      id: 1,
      title: "Scheduler",
      icon: schedulerIcon,
      path: "/scheduler",
      description: "Gestione sus citas médicas",
      color: "#0077cc",
    },
    {
      id: 2,
      title: "Atención",
      icon: attentionIcon,
      path: "/atencion",
      description: "Acceda a la atención médica",
      color: "#00b4d8",
    },
    {
      id: 3,
      title: "Autorización de Procedimientos",
      icon: procedureIcon,
      path: "/autorizacion-procedimientos",
      description: "Gestione autorizaciones de procedimientos",
      color: "#ff9800",
    },
    {
      id: 4,
      title: "Autorización de Medicamentos",
      icon: medicationIcon,
      path: "/autorizacion-medicamentos",
      description: "Solicite autorizaciones para medicamentos",
      color: "#4caf50",
    },
  ];

  useEffect(() => {
  }, [user]);

  if (loading) {
    return (
      <div className="page-container">
        <NavbarMedico />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="menu-page-container">
      <NavbarMedico />
      <div className="menu-hero">
        <div className="menu-hero-content">
          <h1>
            Bienvenido Dr(a),{" "}
            <span>
              {user.user_metadata?.nombre || user.email.split("@")[0]}
            </span>
          </h1>
          <p className="hero-subtitle">¿Que deseas hacer hoy?</p>
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
      <FooterMedico />
    </div>
  );
}

export default MenuMedico;