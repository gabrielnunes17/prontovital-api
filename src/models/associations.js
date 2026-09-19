import { User } from "./User.js";
import { Clinica } from "./Clinica.js";
import { Horario } from "./Horario.js";

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
}
