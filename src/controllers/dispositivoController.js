import { Expo } from "expo-server-sdk";
import { Dispositivo } from "../models/Dispositivo.js";

export const registrarDispositivo = async (req, res) => {
  try {
    const { expo_push_token, plataforma } = req.body;
    const id_user = req.usuario.id_user;

    if (!expo_push_token || !Expo.isExpoPushToken(expo_push_token)) {
      return res.status(400).json({
        erro: "Informe um expo_push_token válido (ex: ExponentPushToken[...]).",
      });
    }

    if (!["ios", "android"].includes(plataforma)) {
      return res.status(400).json({
        erro: "A plataforma deve ser 'ios' ou 'android'.",
      });
    }

    const dispositivoExistente = await Dispositivo.findOne({
      where: { expo_push_token },
    });

    if (dispositivoExistente) {
      await dispositivoExistente.update({
        id_user,
        plataforma,
        ativo: true,
      });

      return res.status(200).json({
        mensagem: "Dispositivo atualizado com sucesso.",
        dispositivo: dispositivoExistente,
      });
    }

    const novoDispositivo = await Dispositivo.create({
      id_user,
      expo_push_token,
      plataforma,
      ativo: true,
    });

    return res.status(201).json({
      mensagem: "Dispositivo registrado com sucesso.",
      dispositivo: novoDispositivo,
    });
  } catch (error) {
    console.error("Erro ao registrar dispositivo:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno ao registrar dispositivo." });
  }
};

export const removerDispositivo = async (req, res) => {
  try {
    const { expo_push_token } = req.body;
    const id_user = req.usuario.id_user;

    if (!expo_push_token) {
      return res.status(400).json({ erro: "Informe o expo_push_token." });
    }

    await Dispositivo.update(
      { ativo: false },
      { where: { expo_push_token, id_user } },
    );

    return res.status(200).json({
      mensagem: "Notificações desativadas para este dispositivo.",
    });
  } catch (error) {
    console.error("Erro ao desativar dispositivo:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno ao desativar dispositivo." });
  }
};
