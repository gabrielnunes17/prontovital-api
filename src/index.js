import express from "express";
import cors from "cors";
import { conectarESincronizar } from "./db.js";

import userRoutes from "./routes/userRoutes.js";
import clinicaRoutes from "./routes/clinicaRoutes.js";
import profissionalRoutes from "./routes/profissionalRoutes.js";
import especialidadeRoutes from "./routes/especialidadeRoutes.js";

import { Especialidade } from "./models/Especialidade.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/usuarios", userRoutes);
app.use("/clinicas", clinicaRoutes);
app.use("/profissionais", profissionalRoutes);
app.use("/especialidades", especialidadeRoutes);

conectarESincronizar();

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export async function popularEspecialidades() {
  try {
    const quantidade = await Especialidade.count();

    if (quantidade === 0) {
      const listaPredefinida = [
        {
          nome: "Clínica Geral",
          descricao:
            "Atendimento médico preventivo, diagnóstico primário e encaminhamentos.",
        },
        {
          nome: "Pediatria",
          descricao: "Assistência médica a bebês, crianças e adolescentes.",
        },
        {
          nome: "Ginecologia e Obstetrícia",
          descricao: "Saúde da mulher, gestação e parto.",
        },
        {
          nome: "Ortopedia e Traumatologia",
          descricao:
            "Cuidado de ossos, músculos, articulações e traumas físicos.",
        },
        {
          nome: "Cardiologia",
          descricao:
            "Diagnóstico e tratamento de doenças do coração e sistema cardiovascular.",
        },
        {
          nome: "Oftalmologia",
          descricao:
            "Tratamento e cirurgias de doenças relacionadas aos olhos e à visão.",
        },
        {
          nome: "Otorrinolaringologia",
          descricao: "Tratamento de doenças do ouvido, nariz e garganta.",
        },
        {
          nome: "Dermatologia",
          descricao:
            "Diagnóstico e tratamento de doenças da pele, cabelo e unhas.",
        },
        {
          nome: "Gastroenterologia",
          descricao: "Tratamento de doenças do aparelho digestivo.",
        },
        {
          nome: "Endocrinologia",
          descricao: "Tratamento de distúrbios hormonais e metabólicos.",
        },
        {
          nome: "Neurologia",
          descricao: "Tratamento de distúrbios do sistema nervoso e cérebro.",
        },
        {
          nome: "Psiquiatria",
          descricao:
            "Diagnóstico e prevenção de transtornos mentais e comportamentais.",
        },
        {
          nome: "Psicologia",
          descricao: "Acompanhamento terapêutico e saúde emocional.",
        },
        {
          nome: "Urologia",
          descricao:
            "Tratamento do trato urinário e sistema reprodutor masculino.",
        },
        {
          nome: "Odontologia",
          descricao: "Saúde bucal, tratamento de dentes e gengivas.",
        },
      ];

      await Especialidade.bulkCreate(listaPredefinida);
      console.log("✅ Especialidades predefinidas populadas com sucesso!");
    }
  } catch (error) {
    console.error("❌ Erro ao popular especialidades:", error);
  }
}
