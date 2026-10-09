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

/**
 * @swagger
 * /profissionais:
 *   get:
 *     summary: Retorna a lista de todos os profissionais de saúde
 *     tags: [Profissionais]
 *     description: Acesso permitido para perfis paciente, admin e clinica.
 *     responses:
 *       200:
 *         description: Lista de profissionais retornada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.get(
  "/",
  verificarToken,
  autorizar(["paciente", "admin", "clinica"]),
  consultarProfissionais,
);

/**
 * @swagger
 * /profissionais/{id_profissional}/disponibilidade:
 *   get:
 *     summary: Consulta a disponibilidade de horários de um profissional
 *     tags: [Profissionais]
 *     description: Acesso permitido para perfis paciente, admin e clinica.
 *     parameters:
 *       - in: path
 *         name: id_profissional
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico do profissional
 *     responses:
 *       200:
 *         description: Disponibilidade retornada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.get(
  "/:id_profissional/disponibilidade",
  verificarToken,
  autorizar(["paciente", "admin", "clinica"]),
  consultarDisponibilidade,
);

/**
 * @swagger
 * /profissionais/{id_profissional}/agendamentos:
 *   post:
 *     summary: Cria um novo agendamento com um profissional
 *     tags: [Profissionais]
 *     description: Acesso restrito ao perfil paciente. O ID do paciente é capturado automaticamente pelo token.
 *     parameters:
 *       - in: path
 *         name: id_profissional
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico do profissional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data_agendamento
 *               - horario_agendamento
 *               - id_clinica
 *             properties:
 *               data_agendamento:
 *                 type: string
 *                 format: date
 *                 description: Data da consulta (YYYY-MM-DD)
 *                 example: "2026-10-15"
 *               horario_agendamento:
 *                 type: string
 *                 description: Horário da consulta (HH:MM ou HH:MM:SS)
 *                 example: "14:30:00"
 *               observacao:
 *                 type: string
 *                 description: Observações adicionais do paciente
 *                 example: "Primeira consulta, sinto dores nas costas."
 *               id_clinica:
 *                 type: integer
 *                 description: ID da clínica onde será o atendimento
 *                 example: 1
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (apenas paciente pode agendar)
 */
router.post(
  "/:id_profissional/agendamentos",
  verificarToken,
  autorizar(["paciente"]),
  criarAgendamento,
);

/**
 * @swagger
 * /profissionais/{id_profissional}/horarios:
 *   get:
 *     summary: Consulta os horários de trabalho cadastrados do profissional
 *     tags: [Profissionais]
 *     description: Acesso permitido para perfis paciente, admin, clinica e profissional.
 *     parameters:
 *       - in: path
 *         name: id_profissional
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Lista de horários retornada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.get(
  "/:id_profissional/horarios",
  verificarToken,
  autorizar(["paciente", "admin", "clinica", "profissional"]),
  consultarHorario,
);

/**
 * @swagger
 * /profissionais/{id_profissional}/horarios:
 *   post:
 *     summary: Cria um novo horário de trabalho para o profissional
 *     tags: [Profissionais]
 *     description: Acesso restrito ao perfil clinica.
 *     parameters:
 *       - in: path
 *         name: id_profissional
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do profissional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dia_da_semana:
 *                 type: string
 *                 example: "Terça-feira"
 *               horario_abertura:
 *                 type: string
 *                 example: "09:00"
 *               horario_fechamento:
 *                 type: string
 *                 example: "17:00"
 *     responses:
 *       201:
 *         description: Horário criado com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.post(
  "/:id_profissional/horarios",
  verificarToken,
  autorizar(["clinica"]),
  criarHorario,
);

/**
 * @swagger
 * /profissionais/{id_profissional}/especialidade/{id_especialidade}:
 *   patch:
 *     summary: Vincula uma especialidade a um profissional
 *     tags: [Profissionais]
 *     description: Acesso restrito ao perfil admin.
 *     parameters:
 *       - in: path
 *         name: id_profissional
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do profissional
 *       - in: path
 *         name: id_especialidade
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da especialidade
 *     responses:
 *       200:
 *         description: Especialidade vinculada com sucesso
 *       404:
 *         description: Profissional ou especialidade não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.patch(
  "/:id_profissional/especialidade/:id_especialidade",
  verificarToken,
  autorizar(["admin"]),
  vincularEspecialidade,
);

/**
 * @swagger
 * /profissionais/{id_profissional}:
 *   get:
 *     summary: Consulta um profissional específico pelo ID
 *     tags: [Profissionais]
 *     description: Acesso permitido para perfis admin, paciente e clinica.
 *     parameters:
 *       - in: path
 *         name: id_profissional
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Dados do profissional retornados com sucesso
 *       404:
 *         description: Profissional não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.get(
  "/:id_profissional",
  verificarToken,
  autorizar(["admin", "paciente", "clinica"]),
  consultarProfissional,
);

export default router;
