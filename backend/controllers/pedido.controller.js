const db = require("../models");
const Pedido = db.pedido;

exports.create = async (req, res) => {
  try {
    if (!req.body.fechaPedido) {
      return res.status(400).send({ message: "fechaPedido es obligatoria." });
    }
    const data = await Pedido.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Pedido." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Pedido.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Pedidos." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Pedido.findByPk(id);
    if (!data) return res.status(404).send({ message: `Pedido no encontrado id=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Pedido." });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [num] = await Pedido.update(req.body, { where: { idPedido: id } });
    if (num === 1) return res.send({ message: "Pedido actualizado correctamente." });
    return res.send({ message: `No ha sido posible actualizar Pedido id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando Pedido id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Pedido.destroy({ where: { idPedido: id } });
    if (num === 1) return res.send({ message: "Pedido eliminado correctamente." });
    return res.send({ message: `No ha sido posible eliminar Pedido id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Pedido id=" + req.params.id });
  }
};
