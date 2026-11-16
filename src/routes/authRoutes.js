import { Router } from "express";
import { login, refresh, logout } from "../controllers/authController.js";

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
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renova o token de acesso usando um refresh token válido
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 example: a1b2c3d4e5f6...
 *     responses:
 *       200:
 *         description: Novo par de tokens gerado com sucesso
 *       400:
 *         description: Refresh token não informado
 *       401:
 *         description: Sessão expirada ou usuário inativo
 */
router.post("/refresh", refresh);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Revoga o refresh token e encerra a sessão no dispositivo
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */
router.post("/logout", logout);

export default router;
