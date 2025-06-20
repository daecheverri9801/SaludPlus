const Paciente = require("../models/pacienteModel");
const Historial_Clinico = require("../models/historialModel");
const PacienteBuilder = require("../services/builder/pacienteBuilder");

const listarPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.obtenerTodosLosPacientes();
    if (!pacientes || pacientes.length === 0) {
      return res.status(404).json({ error: "No se encontraron pacientes" });
    }
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los pacientes" });
  }
};

const obtenerPacientePorId = async (req, res) => {
  try {
    const paciente = await Paciente.obtenerPacientePorId(req.params.id);
    if (!paciente)
      return res.status(404).json({ error: "Paciente no encontrado" });
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el paciente" });
  }
};

const crearPaciente = async (req, res) => {
  try {
    const {
      usuario,
      nombre,
      cedula,
      correo_electronico,
      telefono,
      fecha_nacimiento,
      idauth,
      celular,
      direccion,
    } = req.body;

    const paciente = new PacienteBuilder()
      .setUsuario(usuario)
      .setNombre(nombre)
      .setCedula(cedula)
      .setCorreo(correo_electronico)
      .setTelefono(telefono)
      .setFechaNacimiento(fecha_nacimiento)
      .setIdAuth(idauth)
      .setCelular(celular)
      .setDireccion(direccion)
      .build();

    const nuevoPaciente = await Paciente.crearPaciente(paciente);
    res.status(201).json(nuevoPaciente);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al crear paciente", detalle: err.message });
  }
};

const actualizarPaciente = async (req, res) => {
  try {
    const actualizado = await Paciente.actualizarPaciente(
      req.params.id,
      req.body
    );
    if (!actualizado)
      return res.status(404).json({ error: "Paciente no encontrado" });
    res.json(actualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar paciente controller" });
  }
};

const eliminarPaciente = async (req, res) => {
  try {
    await Paciente.eliminar(req.params.id);
    res.json({ mensaje: "Paciente eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar paciente" });
  }
};

module.exports = {
  listarPacientes,
  obtenerPacientePorId,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
