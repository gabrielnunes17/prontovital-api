import { Clinica } from "../models/Clinica.js";
import { User } from "../models/User.js";

async function criarUsuario(req, res) {
  try {
    const { clinica, perfil, ...dadosUsuario } = req.body;

    const usuarioCriado = await User.create({
      ...dadosUsuario,
      perfil,
    });

    let resposta = usuarioCriado.toJSON();

    delete resposta.senha;

    if (perfil === "clinica") {
      const clinicaCriada = await Clinica.create({
        ...clinica,
        id_user: usuarioCriado.id_user,
      });

      resposta = {
        ...resposta,
        ...clinicaCriada.toJSON(),
      };
    }

    return res.status(201).json(resposta);
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      mensagem: error.message,
      erros: error.errors?.map((erro) => ({
        campo: erro.path,
        mensagem: erro.message,
        valor: erro.value,
      })),
    });
  }
}

export default {
  criarUsuario,
};
