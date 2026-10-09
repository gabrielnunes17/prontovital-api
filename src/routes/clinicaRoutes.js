import { Router } from "express";
import {
  consultarClinicas,
  consultarClinicaPorId,
} from "../controllers/clinicaController.js";
import { vincularProfissional } from "../controllers/clinicaController.js";
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
 *     description: Acesso permitido para perfis clinica, admin e paciente.
 *     responses:
 *       200:
 *         description: Lista de clínicas retornada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado para o perfil do usuário
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
 *     description: Acesso permitido para perfis paciente, admin e clinica.
 *     parameters:
 *       - in: path
 *         name: id_clinica
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico da clínica
 *     responses:
 *       200:
 *         description: Dados da clínica e do usuário associado
 *       404:
 *         description: Clínica não encontrada
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.get(
  "/:id_clinica",
  verificarToken,
  autorizar(["paciente", "admin", "clinica"]),
  consultarClinicaPorId,
);

/**
 * @swagger
 * /clinicas/{id_clinica}/horarios:
 *   get:
 *     summary: Consulta os horários de funcionamento de uma clínica
 *     tags: [Clínicas]
 *     description: Acesso permitido para perfis clinica, admin e profissional.
 *     parameters:
 *       - in: path
 *         name: id_clinica
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico da clínica
 *     responses:
 *       200:
 *         description: Lista de horários da clínica
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
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
 *     summary: Cria um novo horário de funcionamento para a clínica
 *     tags: [Clínicas]
 *     description: Acesso restrito ao perfil clinica.
 *     parameters:
 *       - in: path
 *         name: id_clinica
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico da clínica
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dia_da_semana:
 *                 type: string
 *                 example: "Segunda-feira"
 *               horario_abertura:
 *                 type: string
 *                 example: "08:00"
 *               horario_fechamento:
 *                 type: string
 *                 example: "18:00"
 *     responses:
 *       201:
 *         description: Horário criado com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (apenas clínica pode criar)
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
 *     description: Acesso restrito ao perfil admin.
 *     parameters:
 *       - in: path
 *         name: id_clinica
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da clínica
 *       - in: path
 *         name: id_profissional
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do profissional médico
 *     responses:
 *       200:
 *         description: Profissional vinculado com sucesso
 *       404:
 *         description: Clínica ou profissional não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (apenas admin pode vincular)
 */
router.patch(
  "/:id_clinica/profissionais/:id_profissional",
  verificarToken,
  autorizar(["admin"]),
  vincularProfissional,
);

export default router;
