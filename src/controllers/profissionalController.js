import { Op } from "sequelize";
import { Profissional } from "../models/Profissional.js";
import { Clinica } from "../models/Clinica.js";
import { User } from "../models/User.js";

export const consultarProfissionais = async (req, res) => {
  try {
    const { busca } = req.query;

    const regrasProfissional = {};

    if (busca) {
      regrasProfissional[Op.or] = [
        {
          "$User.nome$": {
            [Op.iLike]: `%${busca}%`,
          },
        },
        {
          "$Clinicas.User.nome$": {
            [Op.iLike]: `%${busca}%`,
          },
        },
      ];
    }

    const profissionais = await Profissional.findAll({
      where: regrasProfissional,

      include: [
        {
          model: User,
          where: {
            ativo: true,
            perfil: "profissional",
          },
          attributes: [
            "nome",
            "email",
            "telefone",
            "endereco",
            "cidade",
            "estado",
          ],
        },
        {
          model: Clinica,
          attributes: ["id_clinica"],
          through: {
            attributes: [],
          },
          include: [
            {
              model: User,
              attributes: ["nome"],
            },
          ],
        },
      ],
    });

    return res.status(200).json(profissionais);
  } catch (error) {
    console.error("Erro ao consultar profissionais:", error);

    return res.status(500).json({
      erro: "Erro interno ao buscar os profissionais.",
    });
  }
};

export const consultarProfissional = async (req, res) => {
  try {
    const { id_profissional } = req.params;

    const profissional = await Profissional.findByPk(id_profissional, {
      include: [
        {
          model: User,
          where: {
            ativo: true,
            perfil: "profissional",
          },
          attributes: [
            "nome",
            "email",
            "telefone",
            "endereco",
            "cidade",
            "estado",
          ],
        },
        {
          model: Clinica,
          attributes: ["id_clinica"],
          through: {
            attributes: [],
          },
          include: [
            {
              model: User,
              attributes: ["nome"],
            },
          ],
        },
      ],
    });

    if (!profissional) {
      return res.status(404).json({
        erro: "Profissional não encontrado.",
      });
    }

    return res.status(200).json(profissional);
  } catch (error) {
    console.error("Erro ao consultar profissional:", error);

    return res.status(500).json({
      erro: "Erro interno ao buscar o profissional.",
    });
  }
};
