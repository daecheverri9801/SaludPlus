import { useEffect, useState } from "react";
import { client } from "../supabase/client";
import { useNavigate, Link } from "react-router";
import { Navbar } from "../components/Navbar";
import "../styles.css";
import registerImage from "../assets/register-hero.jpg";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useForm } from "../hooks/useForm";

function Registro() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const initialFormData = {
    username: "",
    nombre: "",
    cedula: "",
    email: "",
    password: "",
    confirmPassword: "",
    celular: "", 
    direccion: "", 
  };

  const { formData, handleChange, handleBlur, fieldErrors, setFieldErrors } =
    useForm(initialFormData);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (user) navigate("/menu");
    };
    checkAuth();
  }, [navigate]);

  const validateField = (field, value) => {
    const errors = {};
    if (!value.trim()) {
      errors[field] = "Este campo es obligatorio";
    }
    return errors;
  };

  const checkDuplicates = async () => {
    const { data: existingUser } = await client
      .from("usuarios")
      .select("*")
      .eq("email", formData.email)
      .single();

    const errors = {};
    if (existingUser) {
      errors.email = "Este correo ya está registrado.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validación de campos
    let formValid = true;
    const newFieldErrors = {};

    for (const field in formData) {
      const errors = validateField(field, formData[field]);
      if (Object.keys(errors).length > 0) {
        formValid = false;
        Object.assign(newFieldErrors, errors);
      }
    }

    setFieldErrors(newFieldErrors);
    if (!formValid) {
      setLoading(false);
      return;
    }

    try {
      // Verificar duplicados
      const duplicateErrors = await checkDuplicates();
      if (Object.keys(duplicateErrors).length > 0) {
        setFieldErrors(duplicateErrors);
        setLoading(false);
        return;
      }

      // Registrar en Supabase Auth
      const { data: authData, error: authError } = await client.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            nombre: formData.nombre,
            cedula: formData.cedula,
            celular: formData.celular, // Nuevo campo
            direccion: formData.direccion, // Nuevo campo
          },
          emailRedirectTo: `${window.location.origin}/menu`,
        },
      });
      const userId = authData?.user?.id || formData.userId;

      if (authError) throw authError;

      // Registrar en tabla 'usuarios'
      const { error: dbError } = await client.from("usuarios").insert([
        {
          id: authData.user?.id,
          email: formData.email,
          username: formData.username,
          nombre: formData.nombre,
          cedula: formData.cedula
        },
      ]);

      if (dbError) {
        if (authData.user) {
          await client.auth.admin.deleteUser(authData.user.id);
        }
        throw dbError;
      }

      const pacienteData = {
        usuario: formData.username,
        nombre: formData.nombre,
        cedula: formData.cedula,
        correo_electronico: formData.email,
        fecha_registro: new Date().toISOString(),
        idauth: userId,
        celular: formData.celular, 
        direccion: formData.direccion, 
      };

      const response = await fetch("http://localhost:3000/api/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pacienteData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Error en la API del backend: " + errorText);
      }

      setSuccess(true);
    } catch (error) {
      setError(
        error.message ||
          "Ocurrió un error durante el registro. Por favor intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-page-container">
        <Navbar />
        <div className="register-success-container">
          <div className="register-success-card">
            <div className="success-icon">✓</div>
            <h2>¡Registro Exitoso!</h2>
            <p>
              Hemos enviado un enlace de confirmación a{" "}
              <strong>{formData.email}</strong>. Por favor revisa tu correo
              electrónico para activar tu cuenta.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="primary-button"
            >
              Ir al Inicio de Sesión
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="register-page-container">
      <Navbar />
      <div className="register-container">
        <div className="register-hero">
          <img src={registerImage} alt="Paciente siendo atendido por médico" />
          <div className="hero-overlay">
            <h2>Únete a nuestra comunidad de salud</h2>
            <p>Regístrate para acceder a todos nuestros servicios médicos</p>
          </div>
        </div>
        <div className="register-form-container">
          <div className="register-form-card">
            <h1>Crear Cuenta</h1>
            <p className="form-subtitle">Completa tus datos para registrarte</p>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre Completo*</label>
                  <input
                    type="text"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="Ej: Juan Pérez"
                    className={`form-input ${
                      fieldErrors.nombre ? "input-error" : ""
                    }`}
                  />
                  {fieldErrors.nombre && (
                    <span className="field-error">{fieldErrors.nombre}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="cedula">Cédula*</label>
                  <input
                    type="text"
                    id="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="Ej: 1234567890"
                    className={`form-input ${
                      fieldErrors.cedula ? "input-error" : ""
                    }`}
                  />
                  {fieldErrors.cedula && (
                    <span className="field-error">{fieldErrors.cedula}</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="celular">Celular*</label>
                <input
                  type="text"
                  id="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Ej: 3001234567"
                  className={`form-input ${
                    fieldErrors.celular ? "input-error" : ""
                  }`}
                />
                {fieldErrors.celular && (
                  <span className="field-error">{fieldErrors.celular}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="direccion">Dirección*</label>
                <input
                  type="text"
                  id="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Ej: Calle 123 #45-67"
                  className={`form-input ${
                    fieldErrors.direccion ? "input-error" : ""
                  }`}
                />
                {fieldErrors.direccion && (
                  <span className="field-error">{fieldErrors.direccion}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="username">Nombre de Usuario*</label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Ej: usuario123"
                  className={`form-input ${
                    fieldErrors.username ? "input-error" : ""
                  }`}
                />
                {fieldErrors.username && (
                  <span className="field-error">{fieldErrors.username}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico*</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Ej: ejemplo@dominio.com"
                  className={`form-input ${
                    fieldErrors.email ? "input-error" : ""
                  }`}
                />
                {fieldErrors.email && (
                  <span className="field-error">{fieldErrors.email}</span>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Contraseña*</label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="Mínimo 6 caracteres"
                    className={`form-input ${
                      fieldErrors.password ? "input-error" : ""
                    }`}
                  />
                  {fieldErrors.password && (
                    <span className="field-error">{fieldErrors.password}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Contraseña*</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="Repite tu contraseña"
                    className={`form-input ${
                      fieldErrors.confirmPassword ? "input-error" : ""
                    }`}
                  />
                  {fieldErrors.confirmPassword && (
                    <span className="field-error">
                      {fieldErrors.confirmPassword}
                    </span>
                  )}
                </div>
              </div>
              <div className="form-terms">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  Acepto los <Link to="/terminos">Términos de servicio</Link> y
                  la <Link to="/privacidad">Política de privacidad</Link>
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="register-button"
              >
                {loading ? (
                  <>
                    <span className="register-spinner"></span> Registrando...
                  </>
                ) : (
                  "Crear Cuenta"
                )}
              </button>
            </form>
            <div className="register-footer">
              <p>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="login-link">
                  Inicia Sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Registro;
