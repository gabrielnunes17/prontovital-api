import { Clinica } from "../models/Clinica.js";

async function criarClinica(req, res) {
  try {
    const clinica = await Clinica.create(req.body);
    res.status(201).json(clinica);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
}

export default {
  criarClinica,
};
