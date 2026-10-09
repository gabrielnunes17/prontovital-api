import express from "express";
import cors from "cors";
import { conectarESincronizar } from "./db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import clinicaRoutes from "./routes/clinicaRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";
import profissionalRoutes from "./routes/profissionalRoutes.js";
import especialidadeRoutes from "./routes/especialidadeRoutes.js";
import { setupSwagger } from "./swagger.js";

const app = express();
setupSwagger(app);
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/usuarios", userRoutes);
app.use("/clinicas", clinicaRoutes);
app.use("/pacientes", pacienteRoutes);
app.use("/profissionais", profissionalRoutes);
app.use("/especialidades", especialidadeRoutes);

try {
  await conectarESincronizar();

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("❌ Erro ao iniciar a API:", error);
  process.exitCode = 1;
}
