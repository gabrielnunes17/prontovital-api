import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Especialidade = sequelize.define(
  "Especialidade",
  {
    id_especialidade: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "especialidades",
    timestamps: true,
  },
);
