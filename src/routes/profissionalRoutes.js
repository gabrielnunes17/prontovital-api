import { Router } from "express";
import {
  consultarProfissionais,
  consultarProfissional,
  vincularEspecialidade,
} from "../controllers/profissionalController.js";
import {
  consultarDisponibilidade,
  consultarHorario,
  criarHorario,
} from "../controllers/horarioController.js";
import { criarAgendamento } from "../controllers/agendamentoController.js";

const router = Router();

router.get("/", consultarProfissionais);
router.get("/:id_profissional/disponibilidade", consultarDisponibilidade);
router.post("/:id_profissional/agendamentos", criarAgendamento);
router.get("/:id_profissional/horarios", consultarHorario);
router.post("/:id_profissional/horarios", criarHorario);
router.patch(
  "/:id_profissional/especialidade/:id_especialidade",
  vincularEspecialidade,
);
router.get("/:id_profissional", consultarProfissional);

export default router;
