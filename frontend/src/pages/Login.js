import { useEffect, useState } from "react";
import { client } from "../supabase/client";
import { useNavigate, Link } from "react-router";
import { Navbar } from "../components/Navbar";
import "../styles.css";
import loginImage from "../assets/login-hero.jpg";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await client.auth.getUser();
      if (user) navigate("/menu");
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/menu");
    } catch (error) {
      setError(error.message || "Credenciales incorrectas. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page-container">
      <Navbar />
      <div className="login-container">
        <div className="login-hero">
          <img src={loginImage} alt="Médico accediendo a historial clínico digital" />
          <div className="hero-overlay">
            <h2>Bienvenido de vuelta</h2>
            <p>Accede a tu portal de salud para gestionar citas, historiales y más</p>
          </div>
        </div>
        <div className="login-form-container">
          <div className="login-form-card">
            <h1>Iniciar Sesión</h1>
            <p className="form-subtitle">Ingresa tus credenciales para acceder</p>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ejemplo@dominio.com" className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="form-input" />
              </div>
              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Recordar sesión</label>
                </div>
                <Link to="/recuperar-contrasena" className="forgot-password">¿Olvidaste tu contraseña?</Link>
              </div>
              <button type="submit" disabled={loading} className="login-button">
                {loading ? <><span className="login-spinner"></span> Iniciando Sesión...</> : "Iniciar Sesión"}
              </button>
            </form>
            <div className="login-footer">
              <p>¿No tienes una cuenta? <Link to="/registro" className="register-link">Regístrate aquí</Link></p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;