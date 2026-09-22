import { Router } from "express";
import { consultarClinicas } from "../controllers/ClinicaController.js";

const router = Router();

router.get("/", consultarClinicas);

export default router;
