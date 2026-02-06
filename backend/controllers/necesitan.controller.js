const db = require("../models");
const Necesitan = db.necesitan;

exports.create = async (req, res) => {
  try {
    if (!req.body.idProducto || !req.body.idServicio) {
      return res.status(400).send({ message: "idProducto e idServicio son obligatorios." });
    }
    const data = await Necesitan.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Necesitan." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Necesitan.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Necesitan." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { idProducto, idServicio } = req.params;
    const data = await Necesitan.findOne({ where: { idProducto, idServicio } });
    if (!data) return res.status(404).send({ message: "Relación Necesitan no encontrada." });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Necesitan." });
  }
};

exports.delete = async (req, res) => {
  try {
    const { idProducto, idServicio } = req.params;
    const num = await Necesitan.destroy({ where: { idProducto, idServicio } });
    if (num === 1) return res.send({ message: "Relación Necesitan eliminada correctamente." });
    return res.send({ message: "No ha sido posible eliminar Necesitan." });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Necesitan." });
  }
};
