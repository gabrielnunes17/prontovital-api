import { Router } from "express";
import { consultarEspecialidades } from "../controllers/especialidadeController.js";
import { verificarToken, autorizar } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /especialidades:
 *   get:
 *     summary: Retorna a lista de todas as especialidades médicas
 *     tags: [Especialidades]
 *     description: Acesso permitido para perfis admin e paciente.
 *     responses:
 *       200:
 *         description: Lista de especialidades retornada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado para o perfil do usuário
 */
router.get(
  "/",
  verificarToken,
  autorizar(["admin", "paciente"]),
  consultarEspecialidades,
);

export default router;
