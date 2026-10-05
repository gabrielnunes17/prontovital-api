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
      allowNull: true,
    },
    id_profissional: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    tableName: "horarios",
    timestamps: true,
    validate: {
      exactlyOneOwner() {
        const hasClinic =
          this.id_clinica !== null && this.id_clinica !== undefined;
        const hasProfessional =
          this.id_profissional !== null && this.id_profissional !== undefined;

        if (hasClinic === hasProfessional) {
          throw new Error(
            "O horário deve estar associado a uma clínica ou a um profissional.",
          );
        }
      },
    },
  },
);
