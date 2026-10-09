import { Paciente } from "../models/Paciente.js";
import { User } from "../models/User.js";

export const consultarPacientePorId = async (req, res) => {
  try {
    const { id_paciente } = req.params;

    const paciente = await Paciente.findByPk(id_paciente, {
      include: [
        {
          model: User,
          attributes: { exclude: ["senha"] },
        },
      ],
    });

    if (!paciente) {
      return res.status(404).json({ erro: "Paciente não encontrado." });
    }

    return res.status(200).json(paciente);
  } catch (error) {
    console.error("Erro ao consultar paciente:", error);
    return res.status(500).json({ erro: "Erro interno ao buscar paciente." });
  }
};

export const consultarPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({
      include: [
        {
          model: User,
          where: { ativo: true },
          attributes: { exclude: ["senha"] },
        },
      ],
    });

    return res.status(200).json(pacientes);
  } catch (error) {
    console.error("Erro ao consultar a lista de pacientes:", error);
    return res.status(500).json({ erro: "Erro interno ao buscar pacientes." });
  }
};
