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
import { verificarToken, autorizar } from "../middlewares/authMiddleware.js";

const router = Router();

router.get(
  "/",
  verificarToken,
  autorizar(["paciente", "admin", "clinica"]),
  consultarProfissionais,
);
router.get(
  "/:id_profissional/disponibilidade",
  verificarToken,
  autorizar(["paciente", "admin", "clinica"]),
  consultarDisponibilidade,
);
router.post(
  "/:id_profissional/agendamentos",
  verificarToken,
  autorizar(["paciente"]),
  criarAgendamento,
);
router.get(
  "/:id_profissional/horarios",
  verificarToken,
  autorizar(["paciente", "admin", "clinica", "profissional"]),
  consultarHorario,
);
router.post(
  "/:id_profissional/horarios",
  verificarToken,
  autorizar(["clinica"]),
  criarHorario,
);
router.patch(
  "/:id_profissional/especialidade/:id_especialidade",
  verificarToken,
  autorizar(["admin"]),
  vincularEspecialidade,
);
router.get(
  "/:id_profissional",
  verificarToken,
  autorizar(["admin", "paciente", "clinica"]),
  consultarProfissional,
);

export default router;
