import express from "express";
import cors from "cors";
import { conectarESincronizar } from "./db.js";

import userRoutes from "./routes/userRoutes.js";
import clinicaRoutes from "./routes/clinicaRoutes.js";
import profissionalRoutes from "./routes/profissionalRoutes.js"

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/usuarios", userRoutes);
app.use("/clinicas", clinicaRoutes);
app.use("/profissionais", profissionalRoutes);

conectarESincronizar();

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
