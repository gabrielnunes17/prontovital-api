import express from "express";
import userController from "../controllers/userController.js";
import { autorizar, verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário (Cadastro de conta e perfil)
 *     tags: [Usuários]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               endereco:
 *                 type: string
 *               cidade:
 *                 type: string
 *               estado:
 *                 type: string
 *               telefone:
 *                 type: string
 *               perfil:
 *                 type: string
 *               cpf:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *               sexo:
 *                 type: string
 *               observacoes:
 *                 type: string
 *               conselho:
 *                 type: string
 *               registro_profissional:
 *                 type: string
 *               uf_registro:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               bairro:
 *                 type: string
 *           examples:
 *             CadastroPaciente:
 *               summary: Cadastro de Paciente
 *               value:
 *                 nome: "Severino Cavalcanti"
 *                 email: "severino@email.com"
 *                 senha: "senhaForte123"
 *                 endereco: "Rua do Sol, 123"
 *                 cidade: "Recife"
 *                 estado: "PE"
 *                 telefone: "81999999999"
 *                 perfil: "paciente"
 *                 cpf: "12345678901"
 *                 data_nascimento: "1990-05-20"
 *                 sexo: "Masculino"
 *                 observacoes: "Alergia a dipirona"
 *             CadastroProfissional:
 *               summary: Cadastro de Profissional
 *               value:
 *                 nome: "Dra. Ana Costa"
 *                 email: "ana.costa@email.com"
 *                 senha: "senhaForte123"
 *                 endereco: "Rua Real da Torre, 89"
 *                 cidade: "Recife"
 *                 estado: "PE"
 *                 telefone: "81977777777"
 *                 perfil: "profissional"
 *                 cpf: "98765432100"
 *                 conselho: "CRM"
 *                 registro_profissional: "12345"
 *                 uf_registro: "PE"
 *             CadastroClinica:
 *               summary: Cadastro de Clínica
 *               value:
 *                 nome: "Clínica Saúde Vital"
 *                 email: "contato@saudevital.com"
 *                 senha: "senhaForte123"
 *                 endereco: "Av. Conselheiro Aguiar, 123"
 *                 cidade: "Recife"
 *                 estado: "PE"
 *                 telefone: "8133334444"
 *                 perfil: "clinica"
 *                 cnpj: "12345678000199"
 *                 bairro: "Boa Viagem"
 *     responses:
 *       201:
 *         description: Usuário e perfil criados com sucesso
 *       400:
 *         description: Dados inválidos ou e-mail/CPF/CNPJ já cadastrado
 */
router.post("/", userController.criarUsuario);

/**
 * @swagger
 * /usuarios/perfil:
 *   patch:
 *     summary: Atualiza os dados do perfil do usuário logado
 *     tags: [Usuários]
 *     description: O ID do usuário é extraído do token JWT. Atualiza os dados básicos e os campos específicos de cada perfil.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               endereco:
 *                 type: string
 *               cidade:
 *                 type: string
 *               estado:
 *                 type: string
 *               telefone:
 *                 type: string
 *               observacoes:
 *                 type: string
 *               bairro:
 *                 type: string
 *           examples:
 *             ExemploPaciente:
 *               summary: Atualização de Paciente
 *               value:
 *                 nome: "Severino Cavalcanti Atualizado"
 *                 endereco: "Rua do Sol, 456"
 *                 cidade: "Olinda"
 *                 estado: "PE"
 *                 telefone: "81988888888"
 *                 observacoes: "Alergia a dipirona e intolerância a lactose"
 *             ExemploClinica:
 *               summary: Atualização de Clínica
 *               value:
 *                 nome: "Clínica Saúde Vital"
 *                 endereco: "Av. Conselheiro Aguiar, 123"
 *                 cidade: "Recife"
 *                 estado: "PE"
 *                 telefone: "8133334444"
 *                 bairro: "Boa Viagem"
 *             ExemploProfissional:
 *               summary: Atualização de Profissional
 *               value:
 *                 nome: "Dra. Ana Costa"
 *                 endereco: "Rua Real da Torre, 89"
 *                 cidade: "Recife"
 *                 estado: "PE"
 *                 telefone: "81977777777"
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.patch(
  "/perfil",
  verificarToken,
  autorizar(["clinica", "profissional", "paciente"]),
  userController.atualizarPerfil,
);

/**
 * @swagger
 * /usuarios/perfil/cancelar:
 *   patch:
 *     summary: Cancela (desativa) a conta do usuário logado
 *     tags: [Usuários]
 *     description: Altera o status da conta do usuário logado para inativo. O ID é extraído do token JWT.
 *     responses:
 *       200:
 *         description: Conta cancelada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.patch(
  "/perfil/cancelar",
  verificarToken,
  autorizar(["clinica", "profissional", "paciente"]),
  userController.cancelarConta,
);

export default router;
