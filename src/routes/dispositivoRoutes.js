import { Router } from "express";
import {
  registrarDispositivo,
  removerDispositivo,
} from "../controllers/dispositivoController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /dispositivos:
 *   post:
 *     summary: Registra ou atualiza o token de Push Notification (Expo) do dispositivo logado
 *     tags: [Dispositivos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - expo_push_token
 *               - plataforma
 *             properties:
 *               expo_push_token:
 *                 type: string
 *                 example: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
 *               plataforma:
 *                 type: string
 *                 enum: [ios, android]
 *                 example: "android"
 *     responses:
 *       201:
 *         description: Dispositivo registrado com sucesso
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   mensagem: "Dispositivo registrado com sucesso."
 *                   dispositivo:
 *                     id_dispositivo: 1
 *                     id_user: 1
 *                     expo_push_token: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
 *                     plataforma: "android"
 *                     ativo: true
 *       400:
 *         description: Token Expo ou plataforma inválidos
 */
router.post("/", verificarToken, registrarDispositivo);

/**
 * @swagger
 * /dispositivos/desativar:
 *   patch:
 *     summary: Desativa o envio de notificações push para o dispositivo (ex. no logout)
 *     tags: [Dispositivos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - expo_push_token
 *             properties:
 *               expo_push_token:
 *                 type: string
 *                 example: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
 *     responses:
 *       200:
 *         description: Notificações desativadas com sucesso
 *         content:
 *           application/json:
 *             examples:
 *               Sucesso:
 *                 value:
 *                   mensagem: "Notificações desativadas para este dispositivo."
 */
router.patch("/desativar", verificarToken, removerDispositivo);

export default router;
