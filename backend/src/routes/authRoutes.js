const express = require('express')
const router = express.Router()
const controller = require('../controllers/authController')

router.post('/', controller.loginConUID)

module.exports = router