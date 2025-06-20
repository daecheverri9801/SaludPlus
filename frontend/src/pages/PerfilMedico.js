import { NavbarMedico } from "../components/NavbarMedico";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import "../components/Perfil.css";
import FooterMedico from "../components/FooterMedico";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import userIcon from "../assets/user-icon.png";

function ProfileSettingsMedico() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const uid = user?.user_metadata?.uid || user?.id;

  const [profileData, setProfileData] = useState({
    id: "",
    registro_medico: "",
    nombre: "",
    cedula: "",
    celular: "",
    direccion: "",
    correo_electronico: "",
    especialidad: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPaciente = async () => {
      if (!uid) return;

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
          `http://localhost:3000/api/medicos/${data.id}`,
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

        const dataPaciente = await responseHistorial.json();
        setProfileData({
          id: dataPaciente.id_paciente || "",
          registro_medico: dataPaciente.registro_medico || "",
          nombre: dataPaciente.nombre || "",
          cedula: dataPaciente.cedula || "",
          celular: dataPaciente.celular || "",
          direccion: dataPaciente.direccion || "",
          correo_electronico: dataPaciente.correo_electronico || "",
          especialidad: dataPaciente.especialidad || "",
        });
      } catch (error) {
        console.error(error);
        setError("Error al cargar los datos del perfil");
      }
    };

    fetchPaciente();
  }, [uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateFields = () => {
    if (isEditing) {
      if (!profileData.celular || !profileData.direccion) {
        setError("Por favor complete todos los campos requeridos");
        return false;
      }
      if (!/^\d{10}$/.test(profileData.celular)) {
        setError("El número de celular debe tener 10 dígitos");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/api/pacientes/${profileData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            celular: profileData.celular,
            direccion: profileData.direccion,
            correo_electronico: profileData.correo_electronico,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Error al actualizar el perfil: " + errorText);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      alert("Perfil actualizado con éxito");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <NavbarMedico />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="profile-settings-container">
      <NavbarMedico />
      <div className="profile-header">
        <img src={userIcon} alt="User Icon" className="user-icon" />
        <h1>Configuración del Perfil</h1>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <h2>Datos Básicos</h2>
        <div className="form-group">
          <label>Registro Médico:</label>
          <input type="text" value={profileData.registro_medico} readOnly />
        </div>
        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" value={profileData.nombre} readOnly />
        </div>
        <div className="form-group">
          <label>Cédula:</label>
          <input type="text" value={profileData.cedula} readOnly />
        </div>
        <div className="form-group">
          <label>Especialidad:</label>
          <input type="text" value={profileData.especialidad} readOnly />
        </div>

        <h2>Contacto</h2>
        <div className="form-group">
          <label>Celular:</label>
          <input
            type="text"
            name="celular"
            value={profileData.celular}
            readOnly
            placeholder="Ej: 3101234567"
          />
        </div>
        <div className="form-group">
          <label>Dirección:</label>
          <input
            type="text"
            name="direccion"
            value={profileData.direccion}
            readOnly
            placeholder="Ej: Calle 123 #45-67"
          />
        </div>
        <div className="form-group">
          <label>Correo Electrónico:</label>
          <input
            type="text"
            name="correo_electronico"
            value={profileData.correo_electronico}
            readOnly
          />
        </div>
      </form>
      <FooterMedico />
    </div>
  );
}

export default ProfileSettingsMedico;
