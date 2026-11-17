import { Expo } from "expo-server-sdk";
import { Dispositivo } from "../models/Dispositivo.js";

const expo = new Expo();

export async function enviarNotificacaoUsuario(
  id_user,
  { titulo, corpo, dados = {} },
) {
  try {
    const dispositivos = await Dispositivo.findAll({
      where: { id_user, ativo: true },
    });

    if (!dispositivos.length) {
      return;
    }

    const mensagens = [];

    for (const disp of dispositivos) {
      if (!Expo.isExpoPushToken(disp.expo_push_token)) {
        console.warn(`Token Expo inválido ignorado: ${disp.expo_push_token}`);
        continue;
      }

      mensagens.push({
        to: disp.expo_push_token,
        sound: "default",
        title: titulo,
        body: corpo,
        data: dados,
      });
    }

    if (!mensagens.length) {
      return;
    }

    const chunks = expo.chunkPushNotifications(mensagens);

    for (const chunk of chunks) {
      const tickets = await expo.sendPushNotificationsAsync(chunk);

      // Verifica se algum aparelho desinstalou o app e desativa o token no banco
      for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];
        if (
          ticket.status === "error" &&
          ticket.details?.error === "DeviceNotRegistered"
        ) {
          const tokenInvalido = chunk[i].to;
          await Dispositivo.update(
            { ativo: false },
            { where: { expo_push_token: tokenInvalido } },
          );
        }
      }
    }
  } catch (error) {
    console.error("Erro ao enviar push notification:", error);
  }
}
