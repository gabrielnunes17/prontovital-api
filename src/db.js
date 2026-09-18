import "dotenv/config";
import { Sequelize } from "sequelize";

// 1. O sequelize é criado primeiro
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

// 2. Função de sincronização
export async function conectarESincronizar() {
  try {
    await sequelize.authenticate();

    // 3. IMPORTANTE: Importação dinâmica!
    // Agora a Clínica só é importada DEPOIS que o sequelize já existe.
    await import("./models/Clinicas.js");

    await sequelize.sync({ alter: true });

    console.log(
      "✅ Banco de dados PostgreSQL conectado e tabelas sincronizadas!",
    );
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error.message);
  }
}
