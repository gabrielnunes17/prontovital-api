import { Router } from "express";
import { login } from "../controllers/authController.js";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário no sistema e gera o token JWT
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email cadastrado do usuário
 *                 example: severino@email.com
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: senhaSuperSegura123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para ser usado no cabeçalho Authorization
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     perfil:
 *                       type: string
 *       401:
 *         description: Credenciais inválidas (e-mail ou senha incorretos).
 */
router.post("/login", login);

export default router;
