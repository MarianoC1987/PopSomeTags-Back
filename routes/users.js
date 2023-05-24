const express = require("express");
const { runValidation } = require("../validators/runValidation");
const {
  userValidator,
  loginValidator,
  verifyToken,
} = require("../validators/validatorUsers");
const {
  registerController,
  loginController,
  searchId,
  allUsers,
  currentLoggedUser,
} = require("../controllers/controllerUsers");

const router = express.Router();

//Registro de usuario
router.post("/registro", userValidator, runValidation, registerController);

//Login
router.post("/login", loginValidator, runValidation, loginController);

//Saber info del usuario actualmente logueado
router.get("/usuarios/currentsession", verifyToken, currentLoggedUser);

//Todos los usuarios
router.get("/usuarios", allUsers);

//Perfil usuario
router.get("/usuario/:id", searchId);

module.exports = router;
