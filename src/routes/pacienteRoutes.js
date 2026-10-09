import { Router } from "express";
import {
  cancelarAgendamento,
  consultarAgendamentosPorPaciente,
} from "../controllers/agendamentoController.js";
import { verificarToken, autorizar } from "../middlewares/authMiddleware.js";
import {
  consultarPacientePorId,
  consultarPacientes,
} from "../controllers/pacienteController.js";

const router = Router();

/**
 * @swagger
 * /pacientes:
 *   get:
 *     summary: Retorna a lista de todos os pacientes ativos
 *     tags: [Pacientes]
 *     description: Acesso restrito ao perfil admin.
 *     responses:
 *       200:
 *         description: Lista de pacientes retornada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (apenas admin)
 */
router.get("/", verificarToken, autorizar(["admin"]), consultarPacientes);

/**
 * @swagger
 * /pacientes/{id_paciente}:
 *   get:
 *     summary: Consulta um paciente pelo ID
 *     tags: [Pacientes]
 *     description: Acesso restrito ao perfil paciente.
 *     parameters:
 *       - in: path
 *         name: id_paciente
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico do paciente
 *     responses:
 *       200:
 *         description: Dados do paciente e do usuário associado
 *       404:
 *         description: Paciente não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.get(
  "/:id_paciente",
  verificarToken,
  autorizar(["paciente"]),
  consultarPacientePorId,
);

/**
 * @swagger
 * /pacientes/{id_paciente}/agendamentos:
 *   get:
 *     summary: Consulta todos os agendamentos de um paciente específico
 *     tags: [Pacientes]
 *     description: Acesso permitido para perfis paciente, admin, profissional e clinica.
 *     parameters:
 *       - in: path
 *         name: id_paciente
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico do paciente
 *     responses:
 *       200:
 *         description: Lista de agendamentos do paciente
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.get(
  "/:id_paciente/agendamentos",
  verificarToken,
  autorizar(["paciente", "admin", "profissional", "clinica"]),
  consultarAgendamentosPorPaciente,
);

/**
 * @swagger
 * /pacientes/{id_paciente}/agendamentos/{id_agendamento}/cancelar:
 *   patch:
 *     summary: Cancela um agendamento específico do paciente
 *     tags: [Pacientes]
 *     description: Acesso permitido para perfis paciente, admin e clinica.
 *     parameters:
 *       - in: path
 *         name: id_paciente
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do paciente
 *       - in: path
 *         name: id_agendamento
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico do agendamento a ser cancelado
 *     responses:
 *       200:
 *         description: Agendamento cancelado com sucesso
 *       404:
 *         description: Agendamento ou paciente não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.patch(
  "/:id_paciente/agendamentos/:id_agendamento/cancelar",
  verificarToken,
  autorizar(["paciente", "admin", "clinica"]),
  cancelarAgendamento,
);

export default router;
