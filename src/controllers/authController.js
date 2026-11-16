import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Paciente } from "../models/Paciente.js";
import { Profissional } from "../models/Profissional.js";
import { Clinica } from "../models/Clinica.js";
import { RefreshToken } from "../models/RefreshToken.js";

async function gerarSessaoUsuario(user) {
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
    const clinica = await Clinica.findOne({ where: { id_user: user.id_user } });
    if (clinica) {
      dadosUsuario.id_clinica = clinica.id_clinica;
      payloadToken.id_clinica = clinica.id_clinica;
    }
  }

  const token = jwt.sign(payloadToken, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  const refreshTokenStr = crypto.randomBytes(40).toString("hex");
  const expiraEm = new Date();
  expiraEm.setDate(expiraEm.getDate() + 30); // Validade de 30 dias

  await RefreshToken.create({
    id_user: user.id_user,
    token: refreshTokenStr,
    expira_em: expiraEm,
  });

  return { token, refresh_token: refreshTokenStr, usuario: dadosUsuario };
}

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !user.ativo) {
      return res
        .status(401)
        .json({ erro: "Credenciais inválidas ou conta inativa." });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const sessao = await gerarSessaoUsuario(user);
    return res.status(200).json(sessao);
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ erro: "Refresh token não informado." });
    }

    const tokenSalvo = await RefreshToken.findOne({
      where: { token: refresh_token },
      include: [{ model: User }],
    });

    if (
      !tokenSalvo ||
      tokenSalvo.revogado ||
      new Date() > tokenSalvo.expira_em
    ) {
      return res
        .status(401)
        .json({ erro: "Sessão expirada. Faça login novamente." });
    }

    if (!tokenSalvo.User || !tokenSalvo.User.ativo) {
      return res.status(401).json({ erro: "Usuário inativo." });
    }

    // Rotação: revoga o token usado e gera um novo par
    await tokenSalvo.update({ revogado: true });

    const novaSessao = await gerarSessaoUsuario(tokenSalvo.User);
    return res.status(200).json(novaSessao);
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

export const logout = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (refresh_token) {
      await RefreshToken.update(
        { revogado: true },
        { where: { token: refresh_token } },
      );
    }

    return res.status(200).json({ mensagem: "Logout realizado com sucesso." });
  } catch (error) {
    console.error("Erro no logout:", error);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};
