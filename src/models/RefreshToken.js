import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    id_refresh_token: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    expira_em: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revogado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "refresh_tokens",
    timestamps: true,
  },
);
