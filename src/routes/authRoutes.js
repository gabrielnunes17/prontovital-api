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
 *             examples:
 *               Sucesso:
 *                 value:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJwZXJmaWwiOiJwYWNpZW50ZSIsImlhdCI6MTY5... (token truncado)"
 *                   usuario:
 *                     id: 1
 *                     nome: "Severino Cavalcanti"
 *                     perfil: "paciente"
 *       401:
 *         description: Credenciais inválidas (e-mail ou senha incorretos).
 *         content:
 *           application/json:
 *             examples:
 *               Erro:
 *                 value:
 *                   erro: "Credenciais inválidas."
 */
router.post("/login", login);

export default router;
