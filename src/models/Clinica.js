import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Clinica = sequelize.define(
  "Clinica",
  {
    id_clinica: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    cnpj: {
      type: DataTypes.STRING(18),
      allowNull: false,
      unique: true,
    },
    bairro: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    id_user: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "clinicas",
    timestamps: true,
  },
);
