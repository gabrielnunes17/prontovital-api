import express from "express";
import clinicaController from "../controllers/userController.js"

const router = express.Router();

router.post("/", clinicaController.criarUsuario);

export default router;