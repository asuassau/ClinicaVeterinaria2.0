const db = require("../models");
const LineaPedido = db.lineaPedido;

exports.create = async (req, res) => {
  try {
    if (!req.body.idPedido || !req.body.idProducto || req.body.cantidad == null || req.body.precioUnitario == null) {
      return res.status(400).send({ message: "idPedido, idProducto, cantidad y precioUnitario son obligatorios." });
    }
    const data = await LineaPedido.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando LineaPedido." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await LineaPedido.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando LineasPedido." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { idPedido, idProducto } = req.params;
    const data = await LineaPedido.findOne({ where: { idPedido, idProducto } });
    if (!data) return res.status(404).send({ message: "LineaPedido no encontrada." });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo LineaPedido." });
  }
};

exports.update = async (req, res) => {
  try {
    const { idPedido, idProducto } = req.params;
    const [num] = await LineaPedido.update(req.body, { where: { idPedido, idProducto } });
    if (num === 1) return res.send({ message: "LineaPedido actualizada correctamente." });
    return res.send({ message: "No ha sido posible actualizar LineaPedido." });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando LineaPedido." });
  }
};

exports.delete = async (req, res) => {
  try {
    const { idPedido, idProducto } = req.params;
    const num = await LineaPedido.destroy({ where: { idPedido, idProducto } });
    if (num === 1) return res.send({ message: "LineaPedido eliminada correctamente." });
    return res.send({ message: "No ha sido posible eliminar LineaPedido." });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando LineaPedido." });
  }
};
