import "dotenv/config";
import { Sequelize } from "sequelize";

const isProduction = process.env.NODE_ENV === "production";

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: isProduction ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {},
});

export async function conectarESincronizar() {
  await sequelize.authenticate();

  const { initAssociations } = await import("./models/associations.js");

  initAssociations();

  await sequelize.sync({ alter: true });
  await sequelize.query(`
    ALTER TABLE "horarios"
    ALTER COLUMN "id_clinica" DROP NOT NULL,
    ALTER COLUMN "id_profissional" DROP NOT NULL
  `);

  const { popularEspecialidades } =
    await import("./controllers/especialidadeController.js");
  await popularEspecialidades();

  console.log(
    "✅ Banco de dados PostgreSQL conectado e tabelas sincronizadas!",
  );
}
