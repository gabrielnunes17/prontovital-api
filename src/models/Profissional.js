import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Profissional = sequelize.define(
  "Profissional",
  {
    id_profissional: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true,
    },
    conselho: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    registro_profissional: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    uf_registro: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    id_user: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "profissionais",
    timestamps: true,
  },
);
