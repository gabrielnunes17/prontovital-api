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
 *     responses:
 *       200:
 *         description: Lista de pacientes retornada
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   - id_paciente: 1
 *                     cpf: "12345678901"
 *                     data_nascimento: "1990-05-20"
 *                     User:
 *                       nome: "Severino Cavalcanti"
 *                       email: "severino@email.com"
 *                       telefone: "81999999999"
 */
router.get("/", verificarToken, autorizar(["admin"]), consultarPacientes);

/**
 * @swagger
 * /pacientes/{id_paciente}:
 *   get:
 *     summary: Consulta um paciente pelo ID
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id_paciente
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Dados do paciente
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   id_paciente: 1
 *                   cpf: "12345678901"
 *                   User:
 *                     nome: "Severino Cavalcanti"
 *                     email: "severino@email.com"
 *       404:
 *         description: Paciente não encontrado
 *         content:
 *           application/json:
 *             examples:
 *               NaoEncontrado:
 *                 value:
 *                   erro: "Paciente não encontrado."
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
 *     summary: Consulta todos os agendamentos de um paciente
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id_paciente
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   - id_agendamento: 15
 *                     status: "confirmado"
 *                     data_agendamento: "2026-10-15"
 *                     horario_agendamento: "14:30:00"
 *                     Profissional:
 *                       id_profissional: 2
 *                       User:
 *                         nome: "Dra. Ana Costa"
 *                       Especialidade:
 *                         id_especialidade: 1
 *                         nome: "Cardiologia"
 *                     Clinica:
 *                       id_clinica: 1
 *                       bairro: "Boa Viagem"
 *                       User:
 *                         nome: "Clínica Saúde Vital"
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
 *     parameters:
 *       - in: path
 *         name: id_paciente
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: id_agendamento
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Agendamento cancelado
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   id_agendamento: 15
 *                   status: "cancelado"
 *       404:
 *         description: Agendamento não encontrado
 *         content:
 *           application/json:
 *             examples:
 *               NaoEncontrado:
 *                 value:
 *                   erro: "Agendamento não encontrado."
 */
router.patch(
  "/:id_paciente/agendamentos/:id_agendamento/cancelar",
  verificarToken,
  autorizar(["paciente", "admin", "clinica"]),
  cancelarAgendamento,
);

export default router;
