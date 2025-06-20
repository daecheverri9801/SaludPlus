import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { client } from "../supabase/client";
import "../styles.css";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import doctorImage from "../assets/doctor-home.jpg";
import healthNews1 from "../assets/news1.jpg";
import healthNews2 from "../assets/news2.jpg";
import healthNews3 from "../assets/news3.jpg";
import iconFamily from "../assets/family-health.png";
import iconVaccine from "../assets/vaccine.png";
import iconHeart from "../assets/heart-care.png";
import { useAuth } from "../hooks/useAuth";

function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const healthNews = [
    {
      id: 1,
      title: "Nuevas guías para el manejo de la hipertensión",
      excerpt: "La OMS actualiza sus recomendaciones para el control de la presión arterial en adultos.",
      image: healthNews1,
      date: "1 Mayo 2025",
    },
    {
      id: 2,
      title: "Avances en la vacuna contra el Alzheimer",
      excerpt: "Estudio clínico muestra resultados prometedores en fase inicial de pruebas.",
      image: healthNews2,
      date: "3 Mayo 2025",
    },
    {
      id: 3,
      title: "Aumento de casos de enfermedades respiratorias",
      excerpt: "Autoridades sanitarias recomiendan medidas preventivas ante temporada invernal.",
      image: healthNews3,
      date: "28 Abril 2025",
    },
  ];

  const healthServices = [
    {
      id: 1,
      title: "Atención familiar",
      description: "Cuidado integral para todos los miembros de la familia",
      icon: iconFamily,
    },
    {
      id: 2,
      title: "Programas de vacunación",
      description: "Calendario completo de inmunizaciones",
      icon: iconVaccine,
    },
    {
      id: 3,
      title: "Cardiología preventiva",
      description: "Evaluaciones para mantener tu corazón sano",
      icon: iconHeart,
    },
  ];

  if (loading) {
    return (
      <div className="public-home-container">
        <Navbar isPublic={!user} />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="public-home-container">
      <Navbar isPublic={!user} />
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Tu salud en buenas manos</h1>
          <p className="hero-subtitle">
            {user ? `Bienvenido de vuelta, ${user.user_metadata?.nombre || user.email.split("@")[0]}` : "Accede a los mejores servicios médicos con nosotros"}
          </p>
          {!user && (
            <div className="hero-buttons">
              <button className="primary-button" onClick={() => navigate("/login")}>Iniciar Sesión</button>
              <button className="secondary-button" onClick={() => navigate("/registro")}>Registrarse</button>
            </div>
          )}
          {user && (
            <div className="hero-buttons">
              <button className="primary-button" onClick={() => navigate("/menu")}>Ir al Menú Principal</button>
            </div>
          )}
        </div>
        <div className="hero-image">
          <img src={doctorImage} alt="Médico profesional" />
        </div>
      </div>
      {/* Health News Section */}
      <div className="news-section">
        <h2>Últimas Noticias de Salud</h2>
        <div className="news-grid">
          {healthNews.map((news) => (
            <div key={news.id} className="news-card">
              <div className="news-image-container">
                <img src={news.image} alt={news.title} />
                <span className="news-date">{news.date}</span>
              </div>
              <div className="news-content">
                <h3>{news.title}</h3>
                <p>{news.excerpt}</p>
                <button className="news-read-more">Leer más</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Services Preview */}
      <div className="services-section">
        <div className="services-header">
          <h2>Nuestros Servicios</h2>
          <p>Conoce lo que ofrecemos para tu bienestar</p>
        </div>
        <div className="services-grid">
          {healthServices.map((service) => (
            <div key={service.id} className="service-card">
              <img src={service.icon} alt={service.title} />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;