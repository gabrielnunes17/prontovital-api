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

export default router;