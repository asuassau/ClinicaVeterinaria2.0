const db = require("../models");
const Atienden = db.atienden;

exports.create = async (req, res) => {
  try {
    if (!req.body.idUsuario || !req.body.idCliente) {
      return res.status(400).send({ message: "idUsuario e idCliente son obligatorios." });
    }
    const data = await Atienden.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Atienden." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Atienden.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Atienden." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { idUsuario, idCliente } = req.params;
    const data = await Atienden.findOne({ where: { idUsuario, idCliente } });
    if (!data) return res.status(404).send({ message: "Relación Atienden no encontrada." });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Atienden." });
  }
};

exports.delete = async (req, res) => {
  try {
    const { idUsuario, idCliente } = req.params;
    const num = await Atienden.destroy({ where: { idUsuario, idCliente } });
    if (num === 1) return res.send({ message: "Relación Atienden eliminada correctamente." });
    return res.send({ message: "No ha sido posible eliminar Atienden." });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Atienden." });
  }
};
