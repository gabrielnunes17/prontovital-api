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
import {
  criarAgendamento,
  consultarAgendamentosPorProfissional,
} from "../controllers/agendamentoController.js";
import { verificarToken, autorizar } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /profissionais:
 *   get:
 *     summary: Retorna a lista de todos os profissionais de saúde
 *     description: "Perfis autorizados: paciente, admin, clinica."
 *     tags: [Profissionais]
 *     parameters:
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Busca por nome do profissional ou da clínica vinculada.
 *       - in: query
 *         name: id_especialidade
 *         schema:
 *           type: integer
 *         description: Filtra profissionais pela especialidade e inclui os dados dela na resposta.
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             examples:
 *               SucessoComEspecialidade:
 *                 summary: Exemplo com filtro por especialidade
 *                 value:
 *                   - id_profissional: 2
 *                     cpf: "98765432100"
 *                     conselho: "CRM"
 *                     registro_profissional: "12345"
 *                     uf_registro: "PE"
 *                     id_user: 2
 *                     id_especialidade: 1
 *                     createdAt: "2026-10-12T12:00:00.000Z"
 *                     updatedAt: "2026-10-12T12:00:00.000Z"
 *                     User:
 *                       nome: "Dra. Ana Costa"
 *                       email: "ana.costa@email.com"
 *                       telefone: "81977777777"
 *                       endereco: "Rua Real da Torre, 89"
 *                       cidade: "Recife"
 *                       estado: "PE"
 *                     Clinicas:
 *                       - id_clinica: 1
 *                         User:
 *                           nome: "Clínica Saúde Vital"
 *                     Especialidade:
 *                       id_especialidade: 1
 *                       nome: "Cardiologia"
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
 *     description: "Perfis autorizados: paciente, admin, clinica."
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id_profissional
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *         required: true
 *         description: Data no formato AAAA-MM-DD
 *     responses:
 *       200:
 *         description: Array de strings com os horários disponíveis
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   - "09:00"
 *                   - "09:30"
 *                   - "10:30"
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
 *   get:
 *     summary: Consulta os agendamentos de um profissional
 *     description: "Perfis autorizados: profissional, admin. O profissional pode consultar apenas os próprios agendamentos. Inclui agendamentos cancelados."
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id_profissional
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de agendamentos do profissional
 *         content:
 *           application/json:
 *             example:
 *               - id_agendamento: 15
 *                 status: confirmado
 *                 data_agendamento: "2026-10-15"
 *                 horario_agendamento: "14:30:00"
 *                 observacao: "Consulta de rotina"
 *                 id_paciente: 1
 *                 id_profissional: 2
 *                 id_clinica: 1
 *                 createdAt: "2026-10-12T12:00:00.000Z"
 *                 updatedAt: "2026-10-12T12:00:00.000Z"
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
 *         description: ID do profissional inválido
 *       403:
 *         description: Acesso negado para este profissional
 *       404:
 *         description: Profissional não encontrado
 *   post:
 *     summary: Cria um novo agendamento com um profissional
 *     description: "Perfil autorizado: paciente."
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id_profissional
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
 *               id_paciente:
 *                 type: integer
 *               id_clinica:
 *                 type: integer
 *               data_agendamento:
 *                 type: string
 *                 example: "2026-10-15"
 *               horario_agendamento:
 *                 type: string
 *                 example: "14:30"
 *               observacao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Agendamento criado
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   id_agendamento: 15
 *                   id_profissional: 2
 *                   id_paciente: 1
 *                   id_clinica: 1
 *                   data_agendamento: "2026-10-15"
 *                   horario_agendamento: "14:30:00"
 *                   observacao: null
 *                   status: "confirmado"
 *                   createdAt: "2026-10-12T12:00:00.000Z"
 *                   updatedAt: "2026-10-12T12:00:00.000Z"
 *       409:
 *         description: Conflito de horário
 *         content:
 *           application/json:
 *             examples:
 *               Conflito:
 *                 value:
 *                   erro: "Já existe um agendamento nesse horário."
 */
router.post(
  "/:id_profissional/agendamentos",
  verificarToken,
  autorizar(["paciente"]),
  criarAgendamento,
);

router.get(
  "/:id_profissional/agendamentos",
  verificarToken,
  autorizar(["profissional", "admin"]),
  consultarAgendamentosPorProfissional,
);

/**
 * @swagger
 * /profissionais/{id_profissional}/horarios:
 *   get:
 *     summary: Consulta os horários de trabalho cadastrados
 *     description: "Perfis autorizados: paciente, admin, clinica, profissional."
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id_profissional
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
 *                   - id_horario: 2
 *                     dia_da_semana: 2
 *                     horario_abertura: "09:00:00"
 *                     horario_fechamento: "17:00:00"
 *                     id_clinica: null
 *                     id_profissional: 2
 *                     createdAt: "2026-10-12T12:00:00.000Z"
 *                     updatedAt: "2026-10-12T12:00:00.000Z"
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
 *     summary: Cria um novo horário de trabalho
 *     description: "Perfil autorizado: clinica."
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id_profissional
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
 *               dias_da_semana:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *               horario_abertura:
 *                 type: string
 *                 example: "09:00"
 *               horario_fechamento:
 *                 type: string
 *                 example: "17:00"
 *     responses:
 *       201:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   - id_horario: 7
 *                     dia_da_semana: 1
 *                     horario_abertura: "09:00:00"
 *                     horario_fechamento: "17:00:00"
 *                     id_clinica: null
 *                     id_profissional: 2
 *                     createdAt: "2026-10-12T12:00:00.000Z"
 *                     updatedAt: "2026-10-12T12:00:00.000Z"
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
 *     description: "Perfil autorizado: admin."
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id_profissional
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: id_especialidade
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
 *                   mensagem: "Especialidade vinculada ao profissional com sucesso."
 *                   profissional:
 *                     id_profissional: 2
 *                     cpf: "98765432100"
 *                     conselho: "CRM"
 *                     registro_profissional: "12345"
 *                     uf_registro: "PE"
 *                     id_user: 2
 *                     id_especialidade: 1
 *                     createdAt: "2026-10-12T12:00:00.000Z"
 *                     updatedAt: "2026-10-12T12:30:00.000Z"
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
 *     summary: Consulta um profissional específico
 *     description: "Perfis autorizados: profissional."
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id_profissional
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
 *                   id_profissional: 2
 *                   cpf: "98765432100"
 *                   conselho: "CRM"
 *                   registro_profissional: "12345"
 *                   uf_registro: "PE"
 *                   id_user: 2
 *                   id_especialidade: 1
 *                   createdAt: "2026-10-12T12:00:00.000Z"
 *                   updatedAt: "2026-10-12T12:00:00.000Z"
 *                   User:
 *                     nome: "Dra. Ana Costa"
 *                     email: "ana.costa@email.com"
 *                     telefone: "81977777777"
 *                     endereco: "Rua Real da Torre, 89"
 *                     cidade: "Recife"
 *                     estado: "PE"
 *                   Clinicas:
 *                     - id_clinica: 1
 *                       User:
 *                         nome: "Clínica Saúde Vital"
 */
router.get(
  "/:id_profissional",
  verificarToken,
  autorizar(["profissional"]),
  consultarProfissional,
);

export default router;
