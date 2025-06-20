import "./App.css";
import { Routes, Route, useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import { AuthGuard } from "./pages/AuthGuard";
import { MedicalAuthGuard } from "./pages/MedicalAuthGuard";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import NotFoundMedico from "./pages/NotFoundMedico";
import Registro from "./pages/Registro";
import Menu from "./pages/Menu";
import MedicalLogin from "./pages/MedicalLogin";
import Terminos from "./pages/Terminos";
import Contacto from "./pages/Contacto";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import ProfileSettings from "./pages/Perfil";
import HistorialClinico from "./pages/HistorialClinico";
import IncapacidadMedica from "./pages/IncapacidadMedica";
import AutorizacionMedica from "./pages/AutorizacionMedica";
import AutorizacionProcedimientos from "./pages/AutorizacionProcedimientos";
import RegistroMedico from "./pages/RegistroMedico";
import MenuMedico from "./pages/MenuMedico";
import ProfileSettingsMedico from "./pages/PerfilMedico";
import Scheduler from "./pages/Scheduler";
import Atencion from "./pages/Atencion";
import Remision from "./pages/Remision";
import SolicitarCita from "./pages/SolicitarCita";
import api from "./api/api";

function App() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await api.get("/api/pacientes");
        setPacientes(response.data);
      } catch (error) {
        console.error("Error al obtener pacientes:", error);
        setError("Error al obtener pacientes");
      }
    };

    fetchPacientes();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* Rutas públicas */}
        <Route path="*" element={<NotFound />} />

        {/* Rutas protegidas */}
        <Route
          path="/menu"
          element={
            <AuthGuard>
              <Menu />
            </AuthGuard>
          }
        />
        <Route
          path="/perfil"
          element={
            <AuthGuard>
              <ProfileSettings />
            </AuthGuard>
          }
        />
        <Route
          path="/historial-clinico"
          element={
            <AuthGuard>
              <HistorialClinico />
            </AuthGuard>
          }
        />
        <Route
          path="/incapacidades"
          element={
            <AuthGuard>
              <IncapacidadMedica />
            </AuthGuard>
          }
        />
        <Route
          path="/autorizacion-medicamentos"
          element={
            <AuthGuard>
              <AutorizacionMedica />
            </AuthGuard>
          }
        />
        <Route
          path="/autorizacion-procedimientos"
          element={
            <AuthGuard>
              <AutorizacionProcedimientos pacientes={pacientes} />
            </AuthGuard>
          }
        />
        <Route
          path="/citas"
          element={
            <AuthGuard>
              <SolicitarCita />
            </AuthGuard>
          }
        />

        {/* Rutas para médicos */}
        <Route
          path="/medical-login"
          element={
            <MedicalAuthGuard>
              <MedicalLogin />
            </MedicalAuthGuard>
          }
        />
        <Route
          path="/registro-medico"
          element={
            <MedicalAuthGuard>
              <RegistroMedico />
            </MedicalAuthGuard>
          }
        />
        <Route
          path="/menu-medico"
          element={
            <MedicalAuthGuard>
              <MenuMedico />
            </MedicalAuthGuard>
          }
        />
        <Route
          path="/perfil-medico"
          element={
            <MedicalAuthGuard>
              <ProfileSettingsMedico />
            </MedicalAuthGuard>
          }
        />
        <Route
          path="/scheduler"
          element={
            <MedicalAuthGuard>
              <Scheduler />
            </MedicalAuthGuard>
          }
        />
        <Route
          path="/atencion"
          element={
            <MedicalAuthGuard>
              <Atencion />
            </MedicalAuthGuard>
          }
        />
        <Route
          path="/remision"
          element={
            <MedicalAuthGuard>
              <Remision />
            </MedicalAuthGuard>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
