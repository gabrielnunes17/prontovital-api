import { Router } from "express";
import { consultarAgendamentos } from "../controllers/agendamentoController.js";
import { autorizar, verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /agendamentos:
 *   get:
 *     summary: Consulta todos os agendamentos
 *     description: Rota disponível apenas para administradores. Inclui agendamentos cancelados.
 *     tags: [Agendamentos]
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada
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
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso permitido apenas para administradores
 */
router.get("/", verificarToken, autorizar(["admin"]), consultarAgendamentos);

export default router;
