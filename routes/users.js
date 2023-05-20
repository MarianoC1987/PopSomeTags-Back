const express = require("express");
const { runValidation } = require("../validators/runValidation");
const {
  userValidator,
  loginValidator,
} = require("../validators/validatorUsers");
const {
  registerController,
  loginController,
} = require("../controllers/controllerUsers");

const router = express.Router();

//Registro de usuario
router.post("/registro", userValidator, runValidation, registerController);

//Login
router.post("/login", loginValidator, runValidation, loginController);

module.exports = router;
