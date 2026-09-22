import { Op } from "sequelize";
import { Clinica } from "../models/Clinica.js";
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
