import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Paciente = sequelize.define(
  "Paciente",
  {
    id_paciente: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true,
    },
    data_nascimento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sexo: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "pacientes",
    timestamps: true,
  },
);
