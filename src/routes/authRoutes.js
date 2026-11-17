import { Router } from "express";
import { login, refresh, logout } from "../controllers/authController.js";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário no sistema e gera o par de tokens
 *     description: Acesso público; não exige autenticação nem perfil.
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
 *               SucessoPaciente:
 *                 summary: Login de Paciente
 *                 value:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   refresh_token: "a1b2c3d4e5f67890..."
 *                   usuario:
 *                     id: 1
 *                     nome: "Severino Cavalcanti"
 *                     perfil: "paciente"
 *                     id_paciente: 1
 *               SucessoProfissional:
 *                 summary: Login de Profissional
 *                 value:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   refresh_token: "b2c3d4e5f6789012..."
 *                   usuario:
 *                     id: 2
 *                     nome: "Dra. Ana Costa"
 *                     perfil: "profissional"
 *                     id_profissional: 1
 *               SucessoClinica:
 *                 summary: Login de Clínica
 *                 value:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   refresh_token: "c3d4e5f678901234..."
 *                   usuario:
 *                     id: 3
 *                     nome: "Clínica Saúde Vital"
 *                     perfil: "clinica"
 *                     id_clinica: 1
 *               SucessoAdmin:
 *                 summary: Login de Administrador
 *                 value:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   refresh_token: "d4e5f67890123456..."
 *                   usuario:
 *                     id: 4
 *                     nome: "Administrador ProntoVital"
 *                     perfil: "admin"
 *       401:
 *         description: Credenciais inválidas ou conta inativa.
 *         content:
 *           application/json:
 *             examples:
 *               Erro:
 *                 value:
 *                   erro: "Credenciais inválidas ou conta inativa."
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renova o token de acesso usando um refresh token válido (com rotação)
 *     description: Acesso público; não exige token Bearer ativo no cabeçalho.
 *     tags: [Autenticação]
 *     security: []
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
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   refresh_token: "f6e5d4c3b2a10987..."
 *                   usuario:
 *                     id: 1
 *                     nome: "Severino Cavalcanti"
 *                     perfil: "paciente"
 *                     id_paciente: 1
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
 *     description: Acesso público; não exige token Bearer ativo no cabeçalho.
 *     tags: [Autenticação]
 *     security: []
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
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   mensagem: "Logout realizado com sucesso."
 */
router.post("/logout", logout);

export default router;