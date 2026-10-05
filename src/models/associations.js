import { User } from "./User.js";
import { Clinica } from "./Clinica.js";
import { Horario } from "./Horario.js";
import { Profissional } from "./Profissional.js";
import { Paciente } from "./Paciente.js";
import { ClinicaProfissional } from "./ClinicaProfissional.js";
import { Especialidade } from "./Especialidade.js";
import { Agendamento } from "./Agendamento.js";

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

  //Relacionamento Clinica e Profissional
  Clinica.belongsToMany(Profissional, {
    through: ClinicaProfissional,
    foreignKey: "id_clinica",
    otherKey: "id_profissional",
  });
  Profissional.belongsToMany(Clinica, {
    through: ClinicaProfissional,
    foreignKey: "id_profissional",
    otherKey: "id_clinica",
  });
  // Relacionamento Especialidade e Profissional
  Especialidade.hasMany(Profissional, {
    foreignKey: "id_especialidade",
    sourceKey: "id_especialidade",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
  Profissional.belongsTo(Especialidade, {
    foreignKey: "id_especialidade",
    targetKey: "id_especialidade",
  });

  // Relacionamentos de Agendamento
  Paciente.hasMany(Agendamento, {
    foreignKey: "id_paciente",
    sourceKey: "id_paciente",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Agendamento.belongsTo(Paciente, {
    foreignKey: "id_paciente",
    targetKey: "id_paciente",
  });

  Clinica.hasMany(Agendamento, {
    foreignKey: "id_clinica",
    sourceKey: "id_clinica",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Agendamento.belongsTo(Clinica, {
    foreignKey: "id_clinica",
    targetKey: "id_clinica",
  });

  Profissional.hasMany(Agendamento, {
    foreignKey: "id_profissional",
    sourceKey: "id_profissional",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Agendamento.belongsTo(Profissional, {
    foreignKey: "id_profissional",
    targetKey: "id_profissional",
  });
}
