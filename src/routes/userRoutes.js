import express from "express";
import userController from "../controllers/userController.js";
import { autorizar, verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário (Cadastro de conta e perfil)
 *     description: Acesso público; não exige autenticação nem perfil.
 *     tags: [Usuários]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *                 paciente:
 *                   cpf: "12345678901"
 *                   data_nascimento: "1990-05-20"
 *                   sexo: "Masculino"
 *                   observacoes: "Alergia a dipirona"
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
 *                 profissional:
 *                   cpf: "98765432100"
 *                   conselho: "CRM"
 *                   registro_profissional: "12345"
 *                   uf_registro: "PE"
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
 *                 clinica:
 *                   cnpj: "12345678000199"
 *                   bairro: "Boa Viagem"
 *     responses:
 *       201:
 *         description: Usuário e perfil criados com sucesso
 *         content:
 *           application/json:
 *             examples:
 *               SucessoPaciente:
 *                 summary: Cadastro de paciente realizado com sucesso
 *                 value:
 *                   id_user: 1
 *                   nome: "Severino Cavalcanti"
 *                   email: "severino@email.com"
 *                   endereco: "Rua do Sol, 123"
 *                   cidade: "Recife"
 *                   estado: "PE"
 *                   telefone: "81999999999"
 *                   ativo: true
 *                   perfil: "paciente"
 *                   id_paciente: 1
 *                   cpf: "12345678901"
 *                   data_nascimento: "1990-05-20T00:00:00.000Z"
 *                   sexo: "Masculino"
 *                   observacoes: "Alergia a dipirona"
 *                   createdAt: "2026-10-12T12:00:00.000Z"
 *                   updatedAt: "2026-10-12T12:00:00.000Z"
 *               SucessoProfissional:
 *                 summary: Cadastro de profissional realizado com sucesso
 *                 value:
 *                   id_user: 2
 *                   nome: "Dra. Ana Costa"
 *                   email: "ana.costa@email.com"
 *                   endereco: "Rua Real da Torre, 89"
 *                   cidade: "Recife"
 *                   estado: "PE"
 *                   telefone: "81977777777"
 *                   ativo: true
 *                   perfil: "profissional"
 *                   id_profissional: 1
 *                   cpf: "98765432100"
 *                   conselho: "CRM"
 *                   registro_profissional: "12345"
 *                   uf_registro: "PE"
 *                   createdAt: "2026-10-12T12:00:00.000Z"
 *                   updatedAt: "2026-10-12T12:00:00.000Z"
 *               SucessoClinica:
 *                 summary: Cadastro de clínica realizado com sucesso
 *                 value:
 *                   id_user: 3
 *                   nome: "Clínica Saúde Vital"
 *                   email: "contato@saudevital.com"
 *                   endereco: "Av. Conselheiro Aguiar, 123"
 *                   cidade: "Recife"
 *                   estado: "PE"
 *                   telefone: "8133334444"
 *                   ativo: true
 *                   perfil: "clinica"
 *                   id_clinica: 1
 *                   cnpj: "12345678000199"
 *                   bairro: "Boa Viagem"
 *                   createdAt: "2026-10-12T12:00:00.000Z"
 *                   updatedAt: "2026-10-12T12:00:00.000Z"
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             examples:
 *               ErroValidacao:
 *                 value:
 *                   mensagem: "Os dados do paciente são obrigatórios para este perfil."
 *                   erros: []
 */
router.post("/", userController.criarUsuario);

/**
 * @swagger
 * /usuarios/perfil:
 *   patch:
 *     summary: Atualiza os dados do perfil do usuário logado
 *     description: "Perfis autorizados: admin, clinica, profissional, paciente."
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             AtualizarPaciente:
 *               summary: Atualização de Paciente
 *               value:
 *                 nome: "Severino Cavalcanti Atualizado"
 *                 cidade: "Olinda"
 *                 paciente:
 *                   observacoes: "Alergia a dipirona e intolerância a lactose"
 *             AtualizarClinica:
 *               summary: Atualização de Clínica
 *               value:
 *                 telefone: "8133334444"
 *                 clinica:
 *                   bairro: "Boa Viagem"
 *             AtualizarProfissional:
 *               summary: Atualização de Profissional
 *               value:
 *                 telefone: "81977777777"
 *                 profissional:
 *                   conselho: "CRM"
 *                   registro_profissional: "12345"
 *                   uf_registro: "PE"
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             examples:
 *               SucessoPaciente:
 *                 summary: Perfil de paciente atualizado com sucesso
 *                 value:
 *                   id_user: 1
 *                   nome: "Severino Cavalcanti Atualizado"
 *                   email: "severino@email.com"
 *                   endereco: "Rua do Sol, 123"
 *                   cidade: "Olinda"
 *                   estado: "PE"
 *                   telefone: "81999999999"
 *                   ativo: true
 *                   perfil: "paciente"
 *                   id_paciente: 1
 *                   cpf: "12345678901"
 *                   data_nascimento: "1990-05-20T00:00:00.000Z"
 *                   sexo: "Masculino"
 *                   observacoes: "Alergia a dipirona e intolerância a lactose"
 *                   createdAt: "2026-10-12T12:00:00.000Z"
 *                   updatedAt: "2026-10-12T12:30:00.000Z"
 *               SucessoProfissional:
 *                 summary: Perfil de profissional atualizado com sucesso
 *                 value:
 *                   id_user: 2
 *                   nome: "Dra. Ana Costa"
 *                   email: "ana.costa@email.com"
 *                   endereco: "Rua Real da Torre, 89"
 *                   cidade: "Recife"
 *                   estado: "PE"
 *                   telefone: "81977777777"
 *                   ativo: true
 *                   perfil: "profissional"
 *                   id_profissional: 1
 *                   cpf: "98765432100"
 *                   conselho: "CRM"
 *                   registro_profissional: "12345"
 *                   uf_registro: "PE"
 *                   createdAt: "2026-10-12T12:00:00.000Z"
 *                   updatedAt: "2026-10-12T12:30:00.000Z"
 *               SucessoClinica:
 *                 summary: Perfil de clínica atualizado com sucesso
 *                 value:
 *                   id_user: 3
 *                   nome: "Clínica Saúde Vital"
 *                   email: "contato@saudevital.com"
 *                   endereco: "Av. Conselheiro Aguiar, 123"
 *                   cidade: "Recife"
 *                   estado: "PE"
 *                   telefone: "8133334444"
 *                   ativo: true
 *                   perfil: "clinica"
 *                   id_clinica: 1
 *                   cnpj: "12345678000199"
 *                   bairro: "Boa Viagem"
 *                   createdAt: "2026-10-12T12:00:00.000Z"
 *                   updatedAt: "2026-10-12T12:30:00.000Z"
 *       400:
 *         description: Campos não permitidos ou erro de validação
 *         content:
 *           application/json:
 *             examples:
 *               Erro:
 *                 value:
 *                   erro: "Campos não permitidos em paciente: campo_invalido."
 */
router.patch(
  "/perfil",
  verificarToken,
  autorizar(["admin", "clinica", "profissional", "paciente"]),
  userController.atualizarPerfil,
);

/**
 * @swagger
 * /usuarios/perfil/cancelar:
 *   patch:
 *     summary: Cancela (desativa) a conta do usuário logado
 *     description: "Perfis autorizados: admin, clinica, profissional, paciente."
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Conta cancelada com sucesso
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   mensagem: "Conta cancelada com sucesso."
 *                   ativo: false
 */
router.patch(
  "/perfil/cancelar",
  verificarToken,
  autorizar(["admin", "clinica", "profissional", "paciente"]),
  userController.cancelarConta,
);

export default router;
