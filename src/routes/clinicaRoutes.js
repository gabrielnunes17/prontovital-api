import { Router } from "express";
import { consultarClinicas } from "../controllers/clinicaController.js";
import { vincularProfissional } from "../controllers/clinicaController.js";
import {
  consultarHorario,
  criarHorario,
} from "../controllers/horarioController.js";

const router = Router();

router.get("/", consultarClinicas);
router.get("/:id_clinica/horarios", consultarHorario);
router.post("/:id_clinica/horarios", criarHorario);
router.patch(
  "/:id_clinica/profissionais/:id_profissional",
  vincularProfissional,
);

export default router;
