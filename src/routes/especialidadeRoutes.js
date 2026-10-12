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
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   - id_especialidade: 1
 *                     nome: "Clínica Geral"
 *                     descricao: "Atendimento médico preventivo..."
 *                   - id_especialidade: 2
 *                     nome: "Pediatria"
 *                     descricao: "Assistência médica a bebês..."
 */
router.get(
  "/",
  verificarToken,
  autorizar(["admin", "paciente"]),
  consultarEspecialidades,
);

export default router;
