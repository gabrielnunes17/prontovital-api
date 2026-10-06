import { Op } from "sequelize";
import { Agendamento } from "../models/Agendamento.js";
import { Clinica } from "../models/Clinica.js";
import { ClinicaProfissional } from "../models/ClinicaProfissional.js";
import { Especialidade } from "../models/Especialidade.js";
import { Horario } from "../models/Horario.js";
import { Paciente } from "../models/Paciente.js";
import { Profissional } from "../models/Profissional.js";
import { User } from "../models/User.js";

const DURACAO_AGENDAMENTO_MINUTOS = 30;

const paraMinutos = (horario) => {
  const [hora, minuto] = horario.split(":").map(Number);
  return hora * 60 + minuto;
};

export const consultarAgendamentosPorPaciente = async (req, res) => {
  try {
    const { id_paciente } = req.params;

    if (!/^\d+$/.test(id_paciente)) {
      return res.status(400).json({ erro: "Informe um id_paciente numérico." });
    }

    const paciente = await Paciente.findByPk(id_paciente);

    if (!paciente) {
      return res.status(404).json({ erro: "Paciente não encontrado." });
    }

    const agendamentos = await Agendamento.findAll({
      where: {
        id_paciente,
        status: { [Op.ne]: "cancelado" },
      },
      order: [
        ["data_agendamento", "ASC"],
        ["horario_agendamento", "ASC"],
      ],
      include: [
        {
          model: Profissional,
          attributes: ["id_profissional"],
          include: [
            { model: User, attributes: ["nome"] },
            {
              model: Especialidade,
              attributes: ["id_especialidade", "nome"],
            },
          ],
        },
        {
          model: Clinica,
          attributes: ["id_clinica", "bairro"],
          include: [{ model: User, attributes: ["nome"] }],
        },
      ],
    });

    return res.status(200).json(agendamentos);
  } catch (error) {
    console.error("Erro ao consultar agendamentos do paciente:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno ao consultar os agendamentos." });
  }
};

export const cancelarAgendamento = async (req, res) => {
  try {
    const { id_paciente, id_agendamento } = req.params;

    if (!/^\d+$/.test(id_paciente) || !/^\d+$/.test(id_agendamento)) {
      return res.status(400).json({
        erro: "Informe IDs numéricos para paciente e agendamento.",
      });
    }

    const agendamento = await Agendamento.findOne({
      where: { id_agendamento, id_paciente },
    });

    if (!agendamento) {
      return res.status(404).json({ erro: "Agendamento não encontrado." });
    }

    agendamento.status = "cancelado";
    await agendamento.save({ fields: ["status"] });

    return res.status(200).json(agendamento);
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno ao cancelar agendamento." });
  }
};

export const criarAgendamento = async (req, res) => {
  try {
    const { id_profissional } = req.params;
    const {
      id_paciente,
      id_clinica,
      data_agendamento,
      horario_agendamento,
      observacao,
    } = req.body;

    const dataValida =
      typeof data_agendamento === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(data_agendamento) &&
      !Number.isNaN(Date.parse(`${data_agendamento}T00:00:00.000Z`)) &&
      new Date(`${data_agendamento}T00:00:00.000Z`)
        .toISOString()
        .slice(0, 10) === data_agendamento;
    const horarioValido =
      typeof horario_agendamento === "string" &&
      /^(?:[01]\d|2[0-3]):[0-5]\d(?::00)?$/.test(horario_agendamento);

    if (!id_paciente || !id_clinica || !dataValida || !horarioValido) {
      return res.status(400).json({
        erro: "Informe id_paciente, id_clinica, data_agendamento (AAAA-MM-DD) e horario_agendamento (HH:mm).",
      });
    }

    const [profissional, paciente, clinica, vinculo] = await Promise.all([
      Profissional.findByPk(id_profissional),
      Paciente.findByPk(id_paciente),
      Clinica.findByPk(id_clinica),
      ClinicaProfissional.findOne({
        where: { id_profissional, id_clinica },
      }),
    ]);

    if (!profissional) {
      return res.status(404).json({ erro: "Profissional não encontrado." });
    }

    if (!paciente) {
      return res.status(404).json({ erro: "Paciente não encontrado." });
    }

    if (!clinica) {
      return res.status(404).json({ erro: "Clínica não encontrada." });
    }

    if (!vinculo) {
      return res.status(400).json({
        erro: "O profissional não está vinculado à clínica informada.",
      });
    }

    const data = data_agendamento;
    const diaDaSemana = new Date(`${data}T00:00:00.000Z`).getUTCDay();
    const inicio = paraMinutos(horario_agendamento);
    const horarios = await Horario.findAll({
      where: { id_profissional, dia_da_semana: diaDaSemana },
    });
    const dentroDoExpediente = horarios.some((horario) => {
      const abertura = paraMinutos(horario.horario_abertura);
      const fechamento = paraMinutos(horario.horario_fechamento);

      return (
        inicio >= abertura &&
        inicio + DURACAO_AGENDAMENTO_MINUTOS <= fechamento &&
        (inicio - abertura) % DURACAO_AGENDAMENTO_MINUTOS === 0
      );
    });

    if (!dentroDoExpediente) {
      return res.status(409).json({
        erro: "O horário escolhido não está disponível na agenda do profissional.",
      });
    }

    const agendamentosExistentes = await Agendamento.findAll({
      where: {
        id_profissional,
        data_agendamento: data,
        status: { [Op.ne]: "cancelado" },
      },
      attributes: ["horario_agendamento"],
    });
    const conflito = agendamentosExistentes.some((agendamento) => {
      if (!agendamento.horario_agendamento) {
        return false;
      }

      const inicioExistente = paraMinutos(agendamento.horario_agendamento);

      return (
        inicioExistente < inicio + DURACAO_AGENDAMENTO_MINUTOS &&
        inicioExistente + DURACAO_AGENDAMENTO_MINUTOS > inicio
      );
    });

    if (conflito) {
      return res.status(409).json({
        erro: "Já existe um agendamento nesse horário.",
      });
    }

    const agendamento = await Agendamento.create({
      id_profissional,
      id_paciente,
      id_clinica,
      data_agendamento: data,
      horario_agendamento:
        horario_agendamento.length === 5
          ? `${horario_agendamento}:00`
          : horario_agendamento,
      obvervacao: observacao ?? null,
    });

    return res.status(201).json(agendamento);
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        erro: "Dados do agendamento inválidos.",
        detalhes: error.errors.map(({ message }) => message),
      });
    }

    return res.status(500).json({ erro: "Erro interno ao criar agendamento." });
  }
};
