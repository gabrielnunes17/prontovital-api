import { Especialidade } from "../models/Especialidade.js";

export const consultarEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidade.findAll({
      where: { status: true },
      order: [["nome", "ASC"]],
    });

    return res.status(200).json(especialidades);
  } catch (error) {
    console.error("Erro ao consultar especialidades:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno ao buscar as especialidades." });
  }
};

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
