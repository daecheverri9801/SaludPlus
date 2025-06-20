import { useEffect, useState } from "react";
import { client } from "../supabase/client";
import { useNavigate, Link } from "react-router";
import { Navbar } from "../components/Navbar";
import "../styles.css";
import doctorLoginImage from "../assets/doctor-login.jpg";
import medicalLogo from "../assets/medical-logo.png";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

function MedicalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (user) navigate("/menu-medico");
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await client.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate("/menu-medico");
    } catch (error) {
      setError(
        error.message || "Credenciales incorrectas. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-login-container">
      <div className="medical-login-left">
        <div className="medical-login-overlay">
          <img src={medicalLogo} alt="Logo Médico" className="medical-logo" />
          <h2>Portal Exclusivo para Profesionales de la Salud</h2>
          <p>
            Acceso seguro al sistema de gestión médica y historiales clínicos de
            pacientes
          </p>
        </div>
        <img
          src={doctorLoginImage}
          alt="Médico trabajando"
          className="medical-login-image"
        />
      </div>

      <div className="medical-login-right">
        <div className="medical-login-card">
          <div className="medical-login-header">
            <img
              src={medicalLogo}
              alt="Logo Médico"
              className="medical-logo-small"
            />
            <h1>Inicio de Sesión Médico</h1>
            <p>Ingrese sus credenciales para acceder al sistema</p>
          </div>

          {error && (
            <div className="medical-login-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ejemplo@dominio.com"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="form-input"
              />
            </div>
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Recordar sesión</label>
              </div>
              <Link to="/recuperar-contrasena" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <button type="submit" disabled={loading} className="login-button">
              {loading ? (
                <>
                  <span className="login-spinner"></span> Iniciando Sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <Link to="/registro-medico" className="registro-medico-link">
                ¿No tienes cuenta? <b>Regístrate como médico</b>
              </Link>
            </div>
          </form>

          <div className="medical-login-footer">
            <p>
              ¿Problemas para acceder? Contacte al{" "}
              <a href="mailto:soporte@saludplus.com">área de soporte</a>
            </p>
            <p className="medical-login-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              Este portal es de uso exclusivo para personal médico autorizado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicalLogin;
