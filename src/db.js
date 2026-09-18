import "dotenv/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

export async function conectarESincronizar() {
  try {
    await sequelize.authenticate();

    await import("./models/Clinica.js");

    await sequelize.sync({ alter: true });

    console.log(
      "✅ Banco de dados PostgreSQL conectado e tabelas sincronizadas!",
    );
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error.message);
  }
}
