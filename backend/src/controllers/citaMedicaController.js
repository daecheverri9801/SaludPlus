const citas = require("../models/citaMedicaModel");
const {
  getDisponibilidadDiaria,
} = require("../services/disponibilidadService");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

async function disponibilidadDiaria(req, res) {
  const { idMedico } = req.params;
  const fecha = req.query.fecha;

  if (!fecha) {
    return res.status(400).json({ mensaje: "Debe indicar ?fecha=YYYY-MM-DD" });
  }

  try {
    const espacios = await getDisponibilidadDiaria(Number(idMedico), fecha);

    const formateados = espacios.map(
      (d) => `${String(d.getHours()).padStart(2, "0")}:00`
    );
    res.json({ fecha, disponibles: formateados });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al calcular disponibilidad" });
  }
}

const obtenerCitas = async (req, res) => {
  try {
    const citasMedicas = await citas.getCitas();

    if (!citasMedicas || citasMedicas.length === 0) {
      return res.status(404).json({ mensaje: "No se encontró citas" });
    }

    res.json(citasMedicas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener citas medicas" });
  }
};

const obtenerCitasPorMedico = async (req, res) => {
  const { id } = req.params;

  try {
    const citasMedicas = await citas.getCitasPorMedico(id);

    if (!citasMedicas || citasMedicas.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron citas para este medico." });
    }

    res.json(citasMedicas);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener citas para este medico" });
  }
};

const obtenerCitasPorPaciente = async (req, res) => {
  const { id } = req.params;

  try {
    const citasMedicas = await citas.getCitasPorPaciente(id);

    if (!citasMedicas || citasMedicas.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron citas para este paciente." });
    }

    res.json(citasMedicas);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener citas para este paciente" });
  }
};

const crearCitaMedica = async (req, res) => {
  const { id_paciente, id_medico, fecha_cita, motivo } = req.body;

  if (!id_paciente || !id_medico || !fecha_cita || !motivo) {
    return res
      .status(400)
      .json({ mensaje: "Faltan datos para crear la cita médica" });
  }

  try {
    const nuevaCita = await citas.crearCita(
      id_paciente,
      id_medico,
      fecha_cita,
      motivo
    );
    nuevaCita.fecha_cita = dayjs(nuevaCita.fecha_cita)
      .tz("America/Bogota")
      .format();
    res.status(201).json(nuevaCita);
  } catch (error) {
    if (error.message.includes("El médico ya tiene una cita")) {
      res.status(409).json({ mensaje: error.message });
    } else {
      console.error(error);
      res.status(500).json({ mensaje: "Error al crear la cita médica" });
    }
  }
};

const eliminarCita = async (req, res) => {
  try {
    await citas.eliminarCita(req.params.id);
    res.json({ mensaje: "Cita eliminada" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar cita" });
  }
};

module.exports = {
  obtenerCitas,
  obtenerCitasPorMedico,
  crearCitaMedica,
  obtenerCitasPorPaciente,
  eliminarCita,
  disponibilidadDiaria,
};
