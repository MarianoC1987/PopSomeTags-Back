const express = require("express");
const { runValidation } = require("../validators/runValidation");
const {
  userValidator,
  loginValidator,
  verifyToken,
  verifyAdmin,
} = require("../validators/validatorUsers");
const {
  registerController,
  loginController,
  searchId,
  allUsers,
  currentLoggedUser,
  deleteUser,
  editUserInfo,
} = require("../controllers/controllerUsers");

const router = express.Router();

//Registro de usuario
router.post("/registro", userValidator, runValidation, registerController);

//Login
router.post("/login", loginValidator, runValidation, loginController);

//Saber info del usuario actualmente logueado
router.get("/usuarios/currentsession", currentLoggedUser);

//Todos los usuarios
router.get("/usuarios", verifyToken, allUsers);

//Perfil usuario
router.get("/usuario/:id", verifyToken, searchId);

//Eliminar usuario
router.delete("/usuario/borrar/:id", verifyToken, deleteUser);

//Editar info de usuario
router.put("/usuario/editar/:id", editUserInfo);

module.exports = router;
