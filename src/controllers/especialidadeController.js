import { Especialidade } from "../models/Especialidade.js";

export const consultarEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidade.findAll({
      where: { status: true },
      order: [["nome", "ASC"]],
    });

    return res.status(200).json(especialidades);
  } catch (error) {
    console.error("Erro ao consultar especialidades:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno ao buscar as especialidades." });
  }
};
