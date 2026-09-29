import { Op } from "sequelize";
import { Clinica } from "../models/Clinica.js";
import { ClinicaProfissional } from "../models/ClinicaProfissional.js";
import { Profissional } from "../models/Profissional.js";
import { User } from "../models/User.js";

export const consultarClinicas = async (req, res) => {
  try {
    const { busca } = req.query;

    const regrasClinica = {};

    if (busca) {
      regrasClinica[Op.or] = [
        { "$User.nome$": { [Op.iLike]: `%${busca}%` } },
        { bairro: { [Op.iLike]: `%${busca}%` } },
      ];
    }

    const clinicas = await Clinica.findAll({
      where: regrasClinica,
      include: [
        {
          model: User,
          where: { ativo: true, perfil: "clinica" },
          attributes: [
            "nome",
            "email",
            "telefone",
            "endereco",
            "cidade",
            "estado",
          ],
        },
      ],
    });

    return res.status(200).json(clinicas);
  } catch (error) {
    console.error("Erro ao consultar clínicas:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno ao buscar as clínicas." });
  }
};

export const vincularProfissional = async (req, res) => {
  try {
    const { id_clinica, id_profissional } = req.params;

    const clinica = await Clinica.findByPk(id_clinica);

    if (!clinica) {
      return res.status(404).json({
        erro: "Clínica não encontrada.",
      });
    }

    const profissional = await Profissional.findByPk(id_profissional);

    if (!profissional) {
      return res.status(404).json({
        erro: "Profissional não encontrado.",
      });
    }

    const vinculoExistente = await ClinicaProfissional.findOne({
      where: {
        id_clinica,
        id_profissional,
      },
    });

    if (vinculoExistente) {
      return res.status(409).json({
        erro: "O profissional já está vinculado a esta clínica.",
      });
    }

    const vinculo = await ClinicaProfissional.create({
      id_clinica,
      id_profissional,
    });

    return res.status(201).json({
      mensagem: "Profissional vinculado à clínica com sucesso.",
      vinculo,
    });
  } catch (error) {
    console.error("Erro ao vincular profissional:", error);

    return res.status(500).json({
      erro: "Erro interno ao vincular profissional à clínica.",
    });
  }
};
