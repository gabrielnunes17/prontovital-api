import { Router } from "express";
import { consultarClinicas } from "../controllers/clinicaController.js";

const router = Router();

router.get("/", consultarClinicas);

export default router;
