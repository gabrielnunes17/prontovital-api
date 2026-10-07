import { Router } from "express";
import {
  cancelarAgendamento,
  consultarAgendamentosPorPaciente,
} from "../controllers/agendamentoController.js";
import { verificarToken, autorizar } from "../middlewares/authMiddleware.js";

const router = Router();

router.get(
  "/:id_paciente/agendamentos",
  verificarToken,
  autorizar(["paciente", "admin", "profissional", "clinica"]),
  consultarAgendamentosPorPaciente,
);
router.patch(
  "/:id_paciente/agendamentos/:id_agendamento/cancelar",
  verificarToken,
  autorizar(["paciente", "admin", "clinica"]),
  cancelarAgendamento,
);

export default router;
