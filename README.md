# Prontovital API

Este é o repositório da API responsável por gerenciar a inteligência de negócios, a pré-triagem, o agendamento de consultas e as integrações com IA da solução digital Prontovital (focada inicialmente no polo médico de Recife). A API fornece dados e serviços em tempo real para sustentar as aplicações Web PWA e Mobile.

## 🎯 O Problema

A dificuldade de encontrar o atendimento adequado e realizar um agendamento de forma simples torna a busca por serviços de saúde uma experiência fragmentada. Por trás dessa jornada, existe o desafio de orquestrar dados médicos, algoritmos de triagem e integrações complexas entre diferentes provedores de forma segura e eficiente.

## 💡 A Solução

Uma arquitetura de API robusta e escalável que centraliza as regras de negócio, os motores de busca e agendamento, e o ecossistema de triagem por Inteligência Artificial. A API expõe endpoints seguros para fornecer dados confiáveis aos clientes frontend.

## 🚀 Sobre o Projeto

O repositório é o núcleo operacional da solução e engloba diversas frentes técnicas:

- **Arquitetura de APIs:** Design e implementação de endpoints RESTful para comunicação client-server.
- **Integração com IA:** Motores de inteligência artificial aplicados no apoio à pré-triagem e orientação do paciente.
- **Segurança & Privacidade:** Gestão segura de autenticação, autorização e proteção de dados sensíveis de saúde.
- **Análise de Sistemas & Engenharia de Dados:** Modelagem de banco de dados e orquestração de fluxos de agendamento.

## 📌 Pilares do Projeto

- **Segurança & Conformidade:** Tratamento rigoroso de dados de saúde e autenticação resiliente.
- **Desempenho & Escalabilidade:** Endpoints de alta performance prontos para suportar múltiplas requisições simultâneas.
- **Integração:** Comunicação fluida e padronizada entre os sistemas de saúde parceiros e os clientes (Mobile e PWA).
- **Inteligência Artificial:** Serviços dedicados ao processamento inteligente da pré-triagem para otimizar a tomada de decisão.

## 🧰 Tecnologias Utilizadas

- **Node.js:** ambiente de execução da API.
- **Express.js:** criação do servidor e dos endpoints HTTP.
- **Sequelize ORM:** mapeamento e comunicação com o banco de dados.
- **PostgreSQL:** banco de dados relacional.
- **Docker Compose:** execução do container do PostgreSQL.

## ▶️ Como Executar

### Pré-requisitos

- Node.js 18 ou superior e npm.
- Docker com o comando Docker Compose disponível.

### Inicialização

1. Instale as dependências na pasta do projeto:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz do projeto com a URL de conexão do banco:

   ```env
   DATABASE_URL=postgres://prontovital_user:prontovital_pass@localhost:5432/prontovital_db
   ```

3. Suba o container do PostgreSQL:

   ```bash
   docker compose up -d
   ```

4. Inicie a API:

   ```bash
   npm run dev
   ```

O servidor ficará disponível em `http://localhost:3000`.

## Atualização de perfil

Usuários autenticados com perfil `clinica`, `profissional` ou `paciente` podem
atualizar os próprios dados parcialmente:

```http
PATCH /usuarios/perfil
Authorization: Bearer <token>
Content-Type: application/json
```

Os campos comuns do usuário (`nome`, `email`, `senha`, `endereco`, `cidade`,
`estado` e `telefone`) são enviados na raiz do JSON. Os campos específicos são
enviados em um objeto com o nome do perfil:

```json
{
  "nome": "Nome atualizado",
  "clinica": {
    "bairro": "Novo bairro"
  }
}
```

Para os demais perfis, use `profissional` ou `paciente` no lugar de `clinica`.
O endpoint atualiza somente o usuário associado ao token e não permite alterar
seu perfil ou identificador.
