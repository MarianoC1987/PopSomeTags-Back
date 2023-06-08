const express = require("express");
const { uploadSell } = require("../controllers/controllerSells");
const { userValidator } = require("../validators/validatorUsers");
const { runValidation } = require("../validators/runValidation");

const router = express.Router();

router.post("/upload", uploadSell);

module.exports = router;
