import { client } from "../supabase/client";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import "../styles.css";
import logo from "../assets/health-logo.png";
import userIcon from "../assets/user-icon.png";

export function NavbarMedico({ isPublic = false }) {
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
      navigate("/medical-login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="navbar" style={{ backgroundColor: "#62b109" }}>
      <div className="navbar-brand" onClick={() => navigate("/menu-medico")}>
        <img src={logo} alt="Logo SaludPlus" className="navbar-logo" />
        <span className="app-name">SaludPlus</span>
      </div>
      <p style={{ color: "white" }}>Perfil Médico</p>
      <div className="navbar-links">
        {user && (
          <>
            <button
              className="nav-link"
              onClick={() => navigate("/menu-medico")}
            >
              Inicio
            </button>
            <button className="nav-link" onClick={() => navigate("/scheduler")}>
              Scheduler
            </button>
            {/* <button className="nav-link" onClick={() => navigate("/atencion")}>
              Atención
            </button> */}
            {/* <button className="nav-link" onClick={() => navigate("/remision")}>
              Remision
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
            </button> */}
          </>
        )}
      </div>

      <div className="navbar-actions">
        {!user && !isPublic ? (
          <>
            <button
              className="nav-button outlined"
              onClick={() => navigate("/medical-login")}
            >
              Iniciar Sesión
            </button>
            <button
              className="nav-button"
              onClick={() => navigate("/registro-medico")}
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
                  onClick={() => navigate("/perfil-medico")}
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
            onClick={() => navigate("/medical-login")}
          >
            Acceder
          </button>
        )}
      </div>
    </nav>
  );
}
