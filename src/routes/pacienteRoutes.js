import { Router } from "express";
import {
  cancelarAgendamento,
  consultarAgendamentosPorPaciente,
} from "../controllers/agendamentoController.js";

const router = Router();

router.get("/:id_paciente/agendamentos", consultarAgendamentosPorPaciente);
router.patch(
  "/:id_paciente/agendamentos/:id_agendamento/cancelar",
  cancelarAgendamento,
);

export default router;
