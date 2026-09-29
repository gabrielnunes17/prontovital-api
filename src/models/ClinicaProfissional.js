import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const ClinicaProfissional = sequelize.define(
  "ClinicaProfissional",
  {
    id_clinica: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },

    id_profissional: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
  },
  {
    tableName: "clinicas_profissionais",
    timestamps: false,
  },
);