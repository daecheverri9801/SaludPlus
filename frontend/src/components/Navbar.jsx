import { client } from "../supabase/client";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import "../styles.css";
import logo from "../assets/health-logo.png";
import userIcon from "../assets/user-icon.png";

export function Navbar({ isPublic = false }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await client.auth.getUser();
      setUser(user);
    };
    checkAuth();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await client.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo SaludPlus" className="navbar-logo" />
        <span className="app-name">SaludPlus</span>
      </div>

      <div className="navbar-links">
        {user && (
          <>
            <button className="nav-link" onClick={() => navigate("/menu")}>
              Inicio
            </button>
            <button
              className="nav-link"
              onClick={() => navigate("/historial-clinico")}
            >
              Historial
            </button>
            <button className="nav-link" onClick={() => navigate("/citas")}>
              Citas
            </button>
            <button
              className="nav-link"
              onClick={() => navigate("/incapacidades")}
            >
              Incapacidades Médicas
            </button>
            <button
              className="nav-link"
              onClick={() => navigate("/autorizacion-medicamentos")}
            >
              Autorización Médicamentos
            </button>
            <button
              className="nav-link"
              onClick={() => navigate("/autorizacion-procedimientos")}
            >
              Autorización Exámenes
            </button>
          </>
        )}
      </div>

      <div className="navbar-actions">
        {!user && !isPublic ? (
          <>
            <button
              className="nav-button outlined"
              onClick={() => navigate("/login")}
            >
              Iniciar Sesión
            </button>
            <button
              className="nav-button"
              onClick={() => navigate("/registro")}
            >
              Registrarse
            </button>
          </>
        ) : user ? (
          <div className="user-dropdown">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
              className="user-button"
            >
              <img src={userIcon} alt="Usuario" className="user-avatar" />
              <span className="user-name">
                {user.user_metadata?.nombre || user.email.split("@")[0]}
              </span>
              <span className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`}>
                ▼
              </span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button
                  onClick={() => navigate("/perfil")}
                  className="dropdown-item"
                >
                  Mi Perfil
                </button>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout">
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="nav-button outlined"
            onClick={() => navigate("/login")}
          >
            Acceder
          </button>
        )}
      </div>
    </nav>
  );
}
