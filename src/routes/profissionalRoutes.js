import { Router } from "express";
import {
  consultarProfissionais,
  consultarProfissional,
  vincularEspecialidade,
} from "../controllers/profissionalController.js";

const router = Router();

router.get("/", consultarProfissionais);
router.patch(
  "/:id_profissional/especialidade/:id_especialidade",
  vincularEspecialidade,
);
router.get("/:id_profissional", consultarProfissional);

export default router;
