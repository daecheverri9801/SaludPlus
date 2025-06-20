const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoControllers');

router.post('/', medicoController.crearMedico);
router.get('/', medicoController.listarMedicos);
router.get('/:id', medicoController.obtenerPorId);
router.put('/:id', medicoController.actualizarMedio);
router.delete('/:id', medicoController.eliminarMedico);

module.exports = router;