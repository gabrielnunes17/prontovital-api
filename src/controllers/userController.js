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

export default {
  criarUsuario,
};
