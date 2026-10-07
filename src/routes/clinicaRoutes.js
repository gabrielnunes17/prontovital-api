import { Router } from "express";
import { consultarClinicas } from "../controllers/clinicaController.js";
import { vincularProfissional } from "../controllers/clinicaController.js";
import {
  consultarHorario,
  criarHorario,
} from "../controllers/horarioController.js";
import { verificarToken, autorizar } from "../middlewares/authMiddleware.js";

const router = Router();

router.get(
  "/",
  verificarToken,
  autorizar(["clinica", "admin", "paciente"]),
  consultarClinicas,
);
router.get(
  "/:id_clinica/horarios",
  verificarToken,
  autorizar(["clinica", "admin", "profissional"]),
  consultarHorario,
);
router.post(
  "/:id_clinica/horarios",
  verificarToken,
  autorizar(["clinica"]),
  criarHorario,
);
router.patch(
  "/:id_clinica/profissionais/:id_profissional",
  verificarToken,
  autorizar(["admin"]),
  vincularProfissional,
);

export default router;
