import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Paciente } from "../models/Paciente.js";
import { Profissional } from "../models/Profissional.js";
import { Clinica } from "../models/Clinica.js";

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const dadosUsuario = {
      id: user.id_user,
      nome: user.nome,
      perfil: user.perfil,
    };

    let payloadToken = { id_user: user.id_user, perfil: user.perfil };

    if (user.perfil === "paciente") {
      const paciente = await Paciente.findOne({
        where: { id_user: user.id_user },
      });
      if (paciente) {
        dadosUsuario.id_paciente = paciente.id_paciente;
        payloadToken.id_paciente = paciente.id_paciente;
      }
    } else if (user.perfil === "profissional") {
      const profissional = await Profissional.findOne({
        where: { id_user: user.id_user },
      });
      if (profissional) {
        dadosUsuario.id_profissional = profissional.id_profissional;
        payloadToken.id_profissional = profissional.id_profissional;
      }
    } else if (user.perfil === "clinica") {
      const clinica = await Clinica.findOne({
        where: { id_user: user.id_user },
      });
      if (clinica) {
        dadosUsuario.id_clinica = clinica.id_clinica;
        payloadToken.id_clinica = clinica.id_clinica;
      }
    }

    const token = jwt.sign(payloadToken, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    return res.status(200).json({
      token,
      usuario: dadosUsuario,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};
