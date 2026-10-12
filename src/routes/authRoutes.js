import { Router } from "express";
import { login } from "../controllers/authController.js";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário no sistema e gera o token JWT
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
 *               Sucesso:
 *                 value:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJwZXJmaWwiOiJwYWNpZW50ZSIsImlhdCI6MTY5... (token truncado)"
 *                   usuario:
 *                     id: 1
 *                     nome: "Severino Cavalcanti"
 *                     perfil: "paciente"
 *                     id_paciente: 1
 *               SucessoProfissional:
 *                 value:
 *                   token: "****** (token truncado)"
 *                   usuario:
 *                     id: 2
 *                     nome: "Dra. Ana Costa"
 *                     perfil: "profissional"
 *                     id_profissional: 1
 *               SucessoClinica:
 *                 value:
 *                   token: "****** (token truncado)"
 *                   usuario:
 *                     id: 3
 *                     nome: "Clínica Saúde Vital"
 *                     perfil: "clinica"
 *                     id_clinica: 1
 *               SucessoAdmin:
 *                 value:
 *                   token: "****** (token truncado)"
 *                   usuario:
 *                     id: 4
 *                     nome: "Administrador ProntoVital"
 *                     perfil: "admin"
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
