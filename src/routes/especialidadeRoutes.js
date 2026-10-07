import { Router } from "express";
import { consultarEspecialidades } from "../controllers/especialidadeController.js";
import { verificarToken, autorizar } from "../middlewares/authMiddleware.js";

const router = Router();

router.get(
  "/",
  verificarToken,
  autorizar(["admin", "paciente"]),
  consultarEspecialidades,
);

export default router;
