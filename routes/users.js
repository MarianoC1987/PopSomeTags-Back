const express = require("express");
const { runValidation } = require("../validators");

const router = express.Router();

//Registro de usuario
router.post("/register");

//Login
router.post("/login");

module.exports = router;
