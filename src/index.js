import express from "express";
import { conectarESincronizar } from "./db.js";

import clinicaRoutes from "./routes/clinicaRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/clinicas", clinicaRoutes);

conectarESincronizar();

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
