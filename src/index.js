import express from "express";
import { conectarESincronizar } from "./db.js";

const app = express();
const PORT = 3000;

// Middleware para JSON
app.use(express.json());

conectarESincronizar();

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
