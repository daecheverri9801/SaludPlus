const express = require("express")
const { handleChat } = require("../controllers/deepseekController")
const router = express.Router()

router.post("/", handleChat)

module.exports = router