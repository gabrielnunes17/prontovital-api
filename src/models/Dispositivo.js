import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Dispositivo = sequelize.define(
  "Dispositivo",
  {
    id_dispositivo: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    expo_push_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    plataforma: {
      type: DataTypes.ENUM("ios", "android"),
      allowNull: false,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "dispositivos",
    timestamps: true,
  },
);
