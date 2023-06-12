const express = require("express");
const { uploadSell, getSales } = require("../controllers/controllerSales");
const { userValidator } = require("../validators/validatorUsers");

const router = express.Router();

//Subir las Ventas
router.post("/upload", userValidator, uploadSell);

//Get para las ventas
router.get("/sales", getSales);

module.exports = router;
