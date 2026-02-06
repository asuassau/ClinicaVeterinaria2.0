const db = require("../models");
const Realizan = db.realizan;

exports.create = async (req, res) => {
  try {
    if (!req.body.idProducto || !req.body.idPedido) {
      return res.status(400).send({ message: "idProducto e idPedido son obligatorios." });
    }
    const data = await Realizan.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Realizan." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Realizan.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Realizan." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { idProducto, idPedido } = req.params;
    const data = await Realizan.findOne({ where: { idProducto, idPedido } });
    if (!data) return res.status(404).send({ message: "Relación Realizan no encontrada." });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Realizan." });
  }
};

exports.delete = async (req, res) => {
  try {
    const { idProducto, idPedido } = req.params;
    const num = await Realizan.destroy({ where: { idProducto, idPedido } });
    if (num === 1) return res.send({ message: "Relación Realizan eliminada correctamente." });
    return res.send({ message: "No ha sido posible eliminar Realizan." });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Realizan." });
  }
};
