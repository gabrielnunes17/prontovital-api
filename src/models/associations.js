import { User } from "./User.js";
import { Clinica } from "./Clinica.js";
import { Horario } from "./Horario.js";
import { Profissional } from "./Profissional.js";
import { Paciente } from "./Paciente.js";

export function initAssociations() {
  // Relacionamento User e Clinica
  User.hasOne(Clinica, {
    foreignKey: "id_user",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Clinica.belongsTo(User, {
    foreignKey: "id_user",
    targetKey: "id_user",
  });

  // Relacionamento User e Profissional
  User.hasOne(Profissional, {
    foreignKey: "id_user",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Profissional.belongsTo(User, {
    foreignKey: "id_user",
    targetKey: "id_user",
  });

  // Relacionamento User e Paciente
  User.hasOne(Paciente, {
    foreignKey: "id_user",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Paciente.belongsTo(User, {
    foreignKey: "id_user",
    targetKey: "id_user",
  });

  // Relacionamento Clinica e Horario
  Clinica.hasMany(Horario, {
    foreignKey: "id_clinica",
    sourceKey: "id_clinica",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Horario.belongsTo(Clinica, {
    foreignKey: "id_clinica",
    targetKey: "id_clinica",
  });

   // Relacionamento Profissional e Horario
  Profissional.hasMany(Horario, {
    foreignKey: "id_profissional",
    sourceKey: "id_profissional",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Horario.belongsTo(Profissional, {
    foreignKey: "id_profissional",
    targetKey: "id_profissional",
  });
}
