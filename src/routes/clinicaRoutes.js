import { Router } from "express";
import {
  consultarClinicas,
  consultarClinicaPorId,
} from "../controllers/clinicaController.js";
import { vincularProfissional } from "../controllers/clinicaController.js";
import { consultarAgendamentosPorClinica } from "../controllers/agendamentoController.js";
import {
  consultarHorario,
  criarHorario,
} from "../controllers/horarioController.js";
import { verificarToken, autorizar } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /clinicas:
 *   get:
 *     summary: Retorna a lista de todas as clínicas
 *     tags: [Clínicas]
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   - id_clinica: 1
 *                     cnpj: "12345678000199"
 *                     bairro: "Boa Viagem"
 *                     User:
 *                       nome: "Clínica Saúde Vital"
 *                       telefone: "8133334444"
 */
router.get(
  "/",
  verificarToken,
  autorizar(["clinica", "admin", "paciente"]),
  consultarClinicas,
);

/**
 * @swagger
 * /clinicas/{id_clinica}:
 *   get:
 *     summary: Consulta uma clínica pelo ID
 *     tags: [Clínicas]
 *     parameters:
 *       - in: path
 *         name: id_clinica
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Dados da clínica
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   id_clinica: 1
 *                   cnpj: "12345678000199"
 *                   User:
 *                     nome: "Clínica Saúde Vital"
 *       404:
 *         description: Clínica não encontrada
 */
router.get(
  "/:id_clinica",
  verificarToken,
  autorizar(["paciente", "admin", "clinica"]),
  consultarClinicaPorId,
);

/**
 * @swagger
 * /clinicas/{id_clinica}/agendamentos:
 *   get:
 *     summary: Consulta os agendamentos de uma clínica
 *     description: Disponível para administradores e para a própria clínica. Inclui agendamentos cancelados.
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id_clinica
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de agendamentos da clínica
 *         content:
 *           application/json:
 *             example:
 *               - id_agendamento: 15
 *                 status: confirmado
 *                 data_agendamento: "2026-10-15"
 *                 horario_agendamento: "14:30:00"
 *                 id_clinica: 1
 *                 Paciente:
 *                   id_paciente: 1
 *                   User:
 *                     nome: "Maria Oliveira"
 *                 Profissional:
 *                   id_profissional: 2
 *                   User:
 *                     nome: "Dra. Ana Costa"
 *                   Especialidade:
 *                     id_especialidade: 1
 *                     nome: "Cardiologia"
 *                 Clinica:
 *                   id_clinica: 1
 *                   bairro: "Boa Viagem"
 *                   User:
 *                     nome: "Clínica Saúde Vital"
 *       400:
 *         description: ID da clínica inválido
 *       403:
 *         description: Acesso negado para esta clínica
 *       404:
 *         description: Clínica não encontrada
 */
router.get(
  "/:id_clinica/agendamentos",
  verificarToken,
  autorizar(["clinica", "admin"]),
  consultarAgendamentosPorClinica,
);

/**
 * @swagger
 * /clinicas/{id_clinica}/horarios:
 *   get:
 *     summary: Consulta os horários de funcionamento de uma clínica
 *     tags: [Clínicas]
 *     parameters:
 *       - in: path
 *         name: id_clinica
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   - id_horario: 1
 *                     dia_da_semana: 1
 *                     horario_abertura: "08:00:00"
 *                     horario_fechamento: "18:00:00"
 *                     id_clinica: 1
 */
router.get(
  "/:id_clinica/horarios",
  verificarToken,
  autorizar(["clinica", "admin", "profissional"]),
  consultarHorario,
);

/**
 * @swagger
 * /clinicas/{id_clinica}/horarios:
 *   post:
 *     summary: Cria novos horários de funcionamento para a clínica
 *     tags: [Clínicas]
 *     parameters:
 *       - in: path
 *         name: id_clinica
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dia_da_semana:
 *                 type: integer
 *                 description: "Use para cadastrar um único dia (0 a 6)."
 *                 example: 1
 *               dias_da_semana:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: "Use para cadastrar múltiplos dias de uma vez."
 *                 example: [1, 2, 3, 4, 5]
 *               horario_abertura:
 *                 type: string
 *                 example: "08:00"
 *               horario_fechamento:
 *                 type: string
 *                 example: "18:00"
 *     responses:
 *       201:
 *         description: Sucesso (Retorna array de horários criados)
 */
router.post(
  "/:id_clinica/horarios",
  verificarToken,
  autorizar(["clinica"]),
  criarHorario,
);

/**
 * @swagger
 * /clinicas/{id_clinica}/profissionais/{id_profissional}:
 *   patch:
 *     summary: Vincula um profissional a uma clínica
 *     tags: [Clínicas]
 *     parameters:
 *       - in: path
 *         name: id_clinica
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: id_profissional
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       201:
 *         description: Vinculo criado
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   mensagem: "Profissional vinculado à clínica com sucesso."
 *                   vinculo:
 *                     id_clinica: "1"
 *                     id_profissional: "2"
 *       409:
 *         description: Vínculo já existe
 *         content:
 *           application/json:
 *             examples:
 *               Conflito:
 *                 value:
 *                   erro: "O profissional já está vinculado a esta clínica."
 */
router.patch(
  "/:id_clinica/profissionais/:id_profissional",
  verificarToken,
  autorizar(["admin"]),
  vincularProfissional,
);

export default router;
