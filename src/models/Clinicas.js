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
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cnpj: {
      type: DataTypes.STRING(18),
      allowNull: false,
      unique: true,
    },
    endereco: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cidade: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    estado: {
      type: DataTypes.CHAR(2),
      allowNull: false,
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    horario_funcionamento: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "clinicas",
    timestamps: false,
  },
);
