import cron from "node-cron";
import { Op } from "sequelize";
import { Agendamento } from "../models/Agendamento.js";
import { Paciente } from "../models/Paciente.js";
import { Profissional } from "../models/Profissional.js";
import { Clinica } from "../models/Clinica.js";
import { User } from "../models/User.js";
import { enviarNotificacaoUsuario } from "../services/pushService.js";

export function iniciarJobLembretes() {
  // Executa no minuto 0 de cada hora (ex: 08:00, 09:00, 10:00...)
  cron.schedule("0 * * * *", async () => {
    try {
      const agora = new Date();
      const em24Horas = new Date(agora.getTime() + 24 * 60 * 60 * 1000);

      // Formata datas para AAAA-MM-DD (considerando o fuso horário de Recife -03:00)
      const hojeStr = agora.toLocaleDateString("en-CA", {
        timeZone: "America/Recife",
      });
      const amanhaStr = em24Horas.toLocaleDateString("en-CA", {
        timeZone: "America/Recife",
      });

      const agendamentos = await Agendamento.findAll({
        where: {
          status: "confirmado",
          lembrete_enviado: false,
          data_agendamento: {
            [Op.in]: [hojeStr, amanhaStr],
          },
        },
        include: [
          { model: Paciente, attributes: ["id_paciente", "id_user"] },
          {
            model: Profissional,
            attributes: ["id_profissional"],
            include: [{ model: User, attributes: ["nome"] }],
          },
          {
            model: Clinica,
            attributes: ["id_clinica"],
            include: [{ model: User, attributes: ["nome"] }],
          },
        ],
      });

      for (const agendamento of agendamentos) {
        // Monta o objeto Date exato da consulta no fuso de Recife (-03:00)
        const dataHoraConsulta = new Date(
          `${agendamento.data_agendamento}T${agendamento.horario_agendamento}-03:00`,
        );

        const diferencaMs = dataHoraConsulta.getTime() - agora.getTime();
        const vinteQuatroHorasMs = 24 * 60 * 60 * 1000;

        // Dispara apenas se a consulta estiver entre agora e as próximas 24h
        if (diferencaMs > 0 && diferencaMs <= vinteQuatroHorasMs) {
          const nomeProfissional =
            agendamento.Profissional?.User?.nome || "seu profissional";
          const nomeClinica =
            agendamento.Clinica?.User?.nome || "clínica parceira";
          const horaFormatada = agendamento.horario_agendamento.slice(0, 5);

          if (agendamento.Paciente?.id_user) {
            await enviarNotificacaoUsuario(agendamento.Paciente.id_user, {
              titulo: "Lembrete de Consulta 🩺",
              corpo: `Você tem uma consulta agendada amanhã (${agendamento.data_agendamento}) às ${horaFormatada} com ${nomeProfissional} em ${nomeClinica}.`,
              dados: {
                tipo: "lembrete",
                id_agendamento: agendamento.id_agendamento,
              },
            });

            // Marca como enviado para não duplicar na próxima execução do cron
            await agendamento.update({ lembrete_enviado: true });
          }
        }
      }
    } catch (error) {
      console.error("Erro no job de lembrete de agendamentos:", error);
    }
  });

  console.log("⏰ Cron Job de lembretes de agendamento inicializado.");
}
