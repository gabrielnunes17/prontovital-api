import { Router } from "express";
import {
  consultarProfissionais,
  consultarProfissional,
} from "../controllers/profissionalController.js";

const router = Router();

router.get("/", consultarProfissionais);
router.get("/:id_profissional", consultarProfissional);

export default router;
