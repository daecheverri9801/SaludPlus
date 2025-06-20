import { useEffect, useState } from "react";
import { client } from "../supabase/client";
import { useNavigate, Link } from "react-router";
import { Navbar } from "../components/Navbar";
import "../styles.css";
import registerImage from "../assets/register-hero.jpg"; // Asegúrate de que la imagen esté disponible
import Footer from "../components/Footer";
import ErrorMessage from "../components/ErrorMessage";
import { useForm } from "../hooks/useForm";

function RegistroMedico() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const initialFormData = {
    nombre: "",
    cedula: "",
    especialidad: "",
    registroMedico: "",
    direccion: "",
    celular: "",
    email: "",
    password: "",
  };

  const { formData, setFormData, setFieldErrors, fieldErrors } =
    useForm(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Generar email automáticamente mientras se escribe el nombre
    if (formData.nombre) {
      const email = `${formData.nombre
        .replace(/\s+/g, "")
        .toLowerCase()}@saludplus.com`;
      setFormData((prevData) => ({
        ...prevData,
        email: email,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        email: "",
      })); // Limpiar el email si no hay nombre
    }
  }, [formData.nombre]);

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
            nombre: formData.nombre,
            cedula: formData.cedula,
            celular: formData.celular,
            direccion: formData.direccion,
            especialidad: formData.especialidad,
          },
          emailRedirectTo: `${window.location.origin}/menu-medico`,
        },
      });
      const userId = authData?.user?.id || formData.userId;

      if (authError) throw authError;

      // Registrar en tabla 'usuarios'
      const { error: dbError } = await client.from("usuarios").insert([
        {
          id: authData.user?.id,
          email: formData.email,
          username: formData.registroMedico,
          nombre: formData.nombre,
          cedula: formData.cedula,
        },
      ]);

      if (dbError) {
        if (authData.user) {
          await client.auth.admin.deleteUser(authData.user.id);
        }
        throw dbError;
      }

      // Enviar datos al backend
      const medicoData = {
        nombre: formData.nombre,
        especialidad: formData.especialidad,
        registro_medico: formData.registroMedico,
        correo_electronico: formData.email,
        idauth: authData.user?.id,
        cedula: formData.cedula,
        direccion: formData.direccion,
        celular: formData.celular,
      };

      const response = await fetch("http://localhost:3000/api/medicos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicoData),
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
        <div className="register-container">
          <div className="register-hero">
            <img src={registerImage} alt="Registro Médico" />
            <div className="hero-overlay">
              <h2>¡Registro Médico Exitoso!</h2>
              <p>
                Hemos registrado al médico con el correo{" "}
                <strong>{formData.email}</strong>.
              </p>
              <button
                onClick={() => navigate("/menu-medico")}
                className="primary-button"
              >
                Ir al Inicio de Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page-container">
      <div className="register-container">
        <div className="register-hero">
          <img src={registerImage} alt="Registro Médico" />
          <div className="hero-overlay">
            <h2>Registro Médico</h2>
          </div>
        </div>
        <div className="register-form-container">
          <div className="register-form-card">
            <h1>Registrar Médico</h1>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre Completo*</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
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
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
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
                <label htmlFor="especialidad">Especialidad*</label>
                <input
                  type="text"
                  id="especialidad"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Medicina General"
                  className={`form-input ${
                    fieldErrors.especialidad ? "input-error" : ""
                  }`}
                />
                {fieldErrors.especialidad && (
                  <span className="field-error">
                    {fieldErrors.especialidad}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="registroMedico">Registro Médico*</label>
                <input
                  type="text"
                  id="registroMedico"
                  name="registroMedico"
                  value={formData.registroMedico}
                  onChange={handleChange}
                  required
                  placeholder="Ej: RM123456"
                  className={`form-input ${
                    fieldErrors.registroMedico ? "input-error" : ""
                  }`}
                />
                {fieldErrors.registroMedico && (
                  <span className="field-error">
                    {fieldErrors.registroMedico}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="direccion">Dirección*</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
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
                <label htmlFor="celular">Celular*</label>
                <input
                  type="text"
                  id="celular"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
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
                <label htmlFor="email">Correo Electrónico*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña*</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <Link to="/medical-login" className="registro-medico-link">
                  ¿Ya tienes una cuenta? <b>Inicia sesión como médico</b>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistroMedico;
