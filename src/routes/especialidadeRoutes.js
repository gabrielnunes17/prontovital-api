import { Router } from "express";
import { consultarEspecialidades } from "../controllers/especialidadeController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", verificarToken, consultarEspecialidades);

export default router;
