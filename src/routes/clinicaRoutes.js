import { Router } from "express";
import { consultarClinicas } from "../controllers/clinicaController.js";
import { vincularProfissional } from "../controllers/clinicaController.js";

const router = Router();

router.get("/", consultarClinicas);
router.post(
  "/:id_clinica/profissionais/:id_profissional",
  vincularProfissional,
);

export default router;
