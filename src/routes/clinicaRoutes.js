import express from "express";
import clinicaController from "../controllers/clinicaController.js"

const router = express.Router();

router.post("/", clinicaController.criarClinica);

export default router;