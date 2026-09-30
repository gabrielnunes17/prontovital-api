import { Router } from "express";
import { consultarEspecialidades } from "../controllers/especialidadeController.js";

const router = Router();

router.get("/", consultarEspecialidades);

export default router;
