import express from "express";
import userController from "../controllers/userController.js";
import { autorizar, verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", userController.criarUsuario);
router.patch(
  "/perfil",
  verificarToken,
  autorizar(["clinica", "profissional", "paciente"]),
  userController.atualizarPerfil,
);
router.patch(
  "/perfil/cancelar",
  verificarToken,
  autorizar(["clinica", "profissional", "paciente"]),
  userController.cancelarConta,
);

export default router;