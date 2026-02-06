const db = require("../models");
const Incluyen = db.incluyen;

exports.create = async (req, res) => {
  try {
    if (!req.body.idCita || !req.body.idProducto) {
      return res.status(400).send({ message: "idCita e idProducto son obligatorios." });
    }
    const data = await Incluyen.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Incluyen." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Incluyen.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Incluyen." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { idCita, idProducto } = req.params;
    const data = await Incluyen.findOne({ where: { idCita, idProducto } });
    if (!data) return res.status(404).send({ message: "Relación Incluyen no encontrada." });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Incluyen." });
  }
};

exports.delete = async (req, res) => {
  try {
    const { idCita, idProducto } = req.params;
    const num = await Incluyen.destroy({ where: { idCita, idProducto } });
    if (num === 1) return res.send({ message: "Relación Incluyen eliminada correctamente." });
    return res.send({ message: "No ha sido posible eliminar Incluyen." });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Incluyen." });
  }
};
