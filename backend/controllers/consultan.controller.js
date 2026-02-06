const db = require("../models");
const Consultan = db.consultan;

exports.create = async (req, res) => {
  try {
    if (!req.body.idUsuario || !req.body.idCliente) {
      return res.status(400).send({ message: "idUsuario e idCliente son obligatorios." });
    }
    const data = await Consultan.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Consultan." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Consultan.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Consultan." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { idUsuario, idCliente } = req.params;
    const data = await Consultan.findOne({ where: { idUsuario, idCliente } });
    if (!data) return res.status(404).send({ message: "Relación Consultan no encontrada." });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Consultan." });
  }
};

exports.delete = async (req, res) => {
  try {
    const { idUsuario, idCliente } = req.params;
    const num = await Consultan.destroy({ where: { idUsuario, idCliente } });
    if (num === 1) return res.send({ message: "Relación Consultan eliminada correctamente." });
    return res.send({ message: "No ha sido posible eliminar Consultan." });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Consultan." });
  }
};
