import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Agendamento = sequelize.define(
  "Agendamento",
  {
    id_agendamento: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM("confirmado", "cancelado"),
      allowNull: false,
      defaultValue: "confirmado",
    },
    data_agendamento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    horario_agendamento: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    obvervacao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_paciente: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    id_profissional: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    id_clinica: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "agendamentos",
    timestamps: true,
  },
);
