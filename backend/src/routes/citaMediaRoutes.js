const express = require("express");
const router = express.Router();
const controller = require("../controllers/citaMedicaController");

router.get("/", controller.obtenerCitas);

router.get("/medico/:id", controller.obtenerCitasPorMedico);

router.get("/paciente/:id", controller.obtenerCitasPorPaciente);

router.post("/", controller.crearCitaMedica);

router.delete("/:id", controller.eliminarCita);

router.get("/disponibilidad/:idMedico", controller.disponibilidadDiaria);

module.exports = router;
