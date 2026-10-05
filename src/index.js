import express from "express";
import cors from "cors";
import { conectarESincronizar } from "./db.js";

import userRoutes from "./routes/userRoutes.js";
import clinicaRoutes from "./routes/clinicaRoutes.js";
import profissionalRoutes from "./routes/profissionalRoutes.js";
import especialidadeRoutes from "./routes/especialidadeRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/usuarios", userRoutes);
app.use("/clinicas", clinicaRoutes);
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
