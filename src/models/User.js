import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import bcrypt from "bcryptjs";

export const User = sequelize.define(
  "User",
  {
    id_user: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    perfil: {
      type: DataTypes.ENUM("paciente", "profissional", "clinica", "admin"),
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,

    hooks: {
      beforeCreate: async (user) => {
        if (user.senha) {
          user.senha = await bcrypt.hash(user.senha, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("senha")) {
          user.senha = await bcrypt.hash(user.senha, 10);
        }
      },
    },
  },
);
