import { Op } from "sequelize";
import { Agendamento } from "../models/Agendamento.js";
import { Clinica } from "../models/Clinica.js";
import { Horario } from "../models/Horario.js";
import { Profissional } from "../models/Profissional.js";

const DURACAO_SLOT_MINUTOS = 30;

const paraMinutos = (horario) => {
  const [hora, minuto] = horario.split(":").map(Number);
  return hora * 60 + minuto;
};

const formatarHorario = (minutos) => {
  const hora = String(Math.floor(minutos / 60)).padStart(2, "0");
  const minuto = String(minutos % 60).padStart(2, "0");
  return `${hora}:${minuto}`;
};

export const consultarDisponibilidade = async (req, res) => {
  try {
    const { id_profissional } = req.params;
    const { data } = req.query;

    if (
      typeof data !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data) ||
      Number.isNaN(Date.parse(`${data}T00:00:00.000Z`)) ||
      new Date(`${data}T00:00:00.000Z`).toISOString().slice(0, 10) !== data
    ) {
      return res.status(400).json({
        erro: "Informe uma data válida no formato AAAA-MM-DD.",
      });
    }

    const profissional = await Profissional.findByPk(id_profissional);

    if (!profissional) {
      return res.status(404).json({ erro: "Profissional não encontrado." });
    }

    const diaDaSemana = new Date(`${data}T00:00:00.000Z`).getUTCDay();
    const [horarios, agendamentos] = await Promise.all([
      Horario.findAll({
        where: { id_profissional, dia_da_semana: diaDaSemana },
        order: [["horario_abertura", "ASC"]],
      }),
      Agendamento.findAll({
        where: {
          id_profissional,
          data_agendamento: data,
          status: { [Op.ne]: "cancelado" },
        },
        attributes: ["horario_agendamento"],
      }),
    ]);

    const horariosAgendados = agendamentos
      .filter((agendamento) => agendamento.horario_agendamento)
      .map((agendamento) => paraMinutos(agendamento.horario_agendamento));
    const disponibilidade = new Map();

    for (const horario of horarios) {
      const abertura = paraMinutos(horario.horario_abertura);
      const fechamento = paraMinutos(horario.horario_fechamento);

      for (
        let inicio = abertura;
        inicio + DURACAO_SLOT_MINUTOS <= fechamento;
        inicio += DURACAO_SLOT_MINUTOS
      ) {
        const fim = inicio + DURACAO_SLOT_MINUTOS;
        const ocupado = horariosAgendados.some(
          (inicioAgendado) =>
            inicioAgendado < fim &&
            inicioAgendado + DURACAO_SLOT_MINUTOS > inicio,
        );

        if (!ocupado) {
          disponibilidade.set(inicio, formatarHorario(inicio));
        }
      }
    }

    return res.status(200).json([...disponibilidade.values()]);
  } catch (error) {
    console.error("Erro ao consultar disponibilidade:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno ao consultar a disponibilidade." });
  }
};

export const consultarHorario = async (req, res) => {
  try {
    const { id_clinica, id_profissional } = req.params;
    const temClinica = id_clinica !== undefined;
    const temProfissional = id_profissional !== undefined;

    if (temClinica === temProfissional) {
      return res.status(400).json({
        erro: "Informe um id_clinica ou id_profissional na rota.",
      });
    }

    const proprietario = temClinica
      ? await Clinica.findByPk(id_clinica)
      : await Profissional.findByPk(id_profissional);

    if (!proprietario) {
      return res.status(404).json({
        erro: temClinica
          ? "Clínica não encontrada."
          : "Profissional não encontrado.",
      });
    }

    const horarios = await Horario.findAll({
      where: temClinica ? { id_clinica } : { id_profissional },
      order: [
        ["dia_da_semana", "ASC"],
        ["horario_abertura", "ASC"],
      ],
    });

    return res.status(200).json(horarios);
  } catch (error) {
    console.error("Erro ao consultar horários:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno ao consultar horários." });
  }
};

export const criarHorario = async (req, res) => {
  try {
    const { id_clinica, id_profissional } = req.params;
    const temClinica = id_clinica !== undefined;
    const temProfissional = id_profissional !== undefined;

    if (temClinica === temProfissional) {
      return res.status(400).json({
        erro: "Informe um id_clinica ou id_profissional na rota.",
      });
    }

    const proprietario = temClinica
      ? await Clinica.findByPk(id_clinica)
      : await Profissional.findByPk(id_profissional);

    if (!proprietario) {
      return res.status(404).json({
        erro: temClinica
          ? "Clínica não encontrada."
          : "Profissional não encontrado.",
      });
    }

    const {
      dia_da_semana,
      dias_da_semana,
      horario_abertura,
      horario_fechamento,
    } = req.body;
    const dias =
      dias_da_semana ?? (dia_da_semana !== undefined ? [dia_da_semana] : null);

    if (
      !Array.isArray(dias) ||
      dias.length === 0 ||
      dias.some((dia) => !Number.isInteger(dia) || dia < 0 || dia > 6)
    ) {
      return res.status(400).json({
        erro: "Informe dias da semana válidos, de 0 a 6.",
      });
    }

    const horarios = await Horario.bulkCreate(
      dias.map((dia) => ({
        dia_da_semana: dia,
        horario_abertura,
        horario_fechamento,
        id_clinica: temClinica ? id_clinica : null,
        id_profissional: temProfissional ? id_profissional : null,
      })),
      { validate: true },
    );

    return res.status(201).json(horarios);
  } catch (error) {
    console.error("Erro ao criar horário:", error);

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "AggregateError"
    ) {
      return res.status(400).json({
        erro: "Dados do horário inválidos.",
        detalhes: error.errors?.map(({ message }) => message) ?? [],
      });
    }

    return res.status(500).json({ erro: "Erro interno ao criar o horário." });
  }
};
