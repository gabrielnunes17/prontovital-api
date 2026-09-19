import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Horario = sequelize.define(
  "Horario",
  {
    id_horario: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    dia_da_semana: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 6 },
    },
    horario_abertura: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    horario_fechamento: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    id_clinica: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: "horarios",
    timestamps: true,
  },
);

