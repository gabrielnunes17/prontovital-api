import { Clinica } from "../models/Clinica.js";
import { User } from "../models/User.js";
import { Paciente } from "../models/Paciente.js";
import { Profissional } from "../models/Profissional.js";
import { sequelize } from "../db.js";

async function criarUsuario(req, res) {
  const t = await sequelize.transaction();

  try {
    const { perfil, ...dadosUsuario } = req.body;

    const usuarioCriado = await User.create(
      {
        ...dadosUsuario,
        perfil,
      },
      { transaction: t },
    );

    let resposta = usuarioCriado.toJSON();
    delete resposta.senha;

    if (perfil === "clinica") {
      if (!req.body.clinica) {
        throw new Error(
          "Os dados da clínica são obrigatórios para este perfil.",
        );
      }

      const clinicaCriada = await Clinica.create(
        {
          ...req.body.clinica,
          id_user: usuarioCriado.id_user,
        },
        { transaction: t },
      );

      resposta = {
        ...resposta,
        ...clinicaCriada.toJSON(),
      };
    }

    if (perfil === "paciente") {
      if (!req.body.paciente) {
        throw new Error(
          "Os dados do paciente são obrigatórios para este perfil.",
        );
      }

      const pacienteCriado = await Paciente.create(
        {
          ...req.body.paciente,
          id_user: usuarioCriado.id_user,
        },
        { transaction: t },
      );

      resposta = {
        ...resposta,
        ...pacienteCriado.toJSON(),
      };
    }

    if (perfil === "profissional") {
      if (!req.body.profissional) {
        throw new Error(
          "Os dados do profissional são obrigatórios para este perfil.",
        );
      }

      const profesionalCriado = await Profissional.create(
        {
          ...req.body.profissional,
          id_user: usuarioCriado.id_user,
        },
        { transaction: t },
      );

      resposta = {
        ...resposta,
        ...profesionalCriado.toJSON(),
      };
    }

    await t.commit();

    return res.status(201).json(resposta);
  } catch (error) {
    await t.rollback();

    console.log(error);

    return res.status(400).json({
      mensagem: error.message,
      erros: error.errors?.map((erro) => ({
        campo: erro.path,
        mensagem: erro.message,
        valor: erro.value,
      })),
    });
  }
}

async function atualizarPerfil(req, res) {
  const camposUsuario = [
    "nome",
    "email",
    "senha",
    "endereco",
    "cidade",
    "estado",
    "telefone",
  ];
  const perfis = {
    clinica: {
      modelo: Clinica,
      chave: "clinica",
      campos: ["cnpj", "bairro"],
    },
    profissional: {
      modelo: Profissional,
      chave: "profissional",
      campos: ["cpf", "conselho", "registro_profissional", "uf_registro"],
    },
    paciente: {
      modelo: Paciente,
      chave: "paciente",
      campos: ["cpf", "data_nascimento", "sexo", "observacoes"],
    },
  };

  let t;

  try {
    const perfil = perfis[req.usuario.perfil];

    if (!perfil) {
      return res.status(403).json({ erro: "Perfil não pode ser atualizado." });
    }

    const dadosRecebidos = req.body ?? {};
    const chavesPermitidas = [...camposUsuario, perfil.chave];
    const chavesInvalidas = Object.keys(dadosRecebidos).filter(
      (chave) => !chavesPermitidas.includes(chave),
    );

    if (chavesInvalidas.length > 0) {
      return res.status(400).json({
        erro: `Campos não permitidos: ${chavesInvalidas.join(", ")}.`,
      });
    }

    const dadosUsuario = Object.fromEntries(
      camposUsuario
        .filter((campo) => Object.hasOwn(dadosRecebidos, campo))
        .map((campo) => [campo, dadosRecebidos[campo]]),
    );

    const dadosPerfilRecebidos = dadosRecebidos[perfil.chave];

    if (
      dadosPerfilRecebidos !== undefined &&
      (dadosPerfilRecebidos === null ||
        typeof dadosPerfilRecebidos !== "object" ||
        Array.isArray(dadosPerfilRecebidos))
    ) {
      return res.status(400).json({
        erro: `Os dados de ${perfil.chave} devem ser um objeto.`,
      });
    }

    const dadosPerfil = dadosPerfilRecebidos ?? {};
    const camposPerfilInvalidos = Object.keys(dadosPerfil).filter(
      (campo) => !perfil.campos.includes(campo),
    );

    if (camposPerfilInvalidos.length > 0) {
      return res.status(400).json({
        erro: `Campos não permitidos em ${perfil.chave}: ${camposPerfilInvalidos.join(", ")}.`,
      });
    }

    const atualizacaoPerfil = Object.fromEntries(
      perfil.campos
        .filter((campo) => Object.hasOwn(dadosPerfil, campo))
        .map((campo) => [campo, dadosPerfil[campo]]),
    );

    if (
      Object.keys(dadosUsuario).length === 0 &&
      Object.keys(atualizacaoPerfil).length === 0
    ) {
      return res.status(400).json({
        erro: "Informe ao menos um campo para atualizar.",
      });
    }

    t = await sequelize.transaction();

    const usuario = await User.findByPk(req.usuario.id_user, {
      transaction: t,
    });

    if (!usuario) {
      await t.rollback();
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    const registroPerfil = await perfil.modelo.findOne({
      where: { id_user: usuario.id_user },
      transaction: t,
    });

    if (!registroPerfil) {
      await t.rollback();
      return res.status(404).json({
        erro: `Dados de ${perfil.chave} não encontrados para este usuário.`,
      });
    }

    if (Object.keys(dadosUsuario).length > 0) {
      await usuario.update(dadosUsuario, { transaction: t });
    }

    if (Object.keys(atualizacaoPerfil).length > 0) {
      await registroPerfil.update(atualizacaoPerfil, { transaction: t });
    }

    await t.commit();

    const respostaUsuario = usuario.toJSON();
    delete respostaUsuario.senha;

    return res.status(200).json({
      ...respostaUsuario,
      ...registroPerfil.toJSON(),
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }

    console.error("Erro ao atualizar perfil:", error);

    return res.status(400).json({
      mensagem: error.message,
      erros: error.errors?.map((erro) => ({
        campo: erro.path,
        mensagem: erro.message,
        valor: erro.value,
      })),
    });
  }
}

export default {
  criarUsuario,
  atualizarPerfil,
};
