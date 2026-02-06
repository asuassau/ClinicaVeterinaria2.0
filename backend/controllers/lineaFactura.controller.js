const db = require("../models");
const LineaFactura = db.lineaFactura;

exports.create = async (req, res) => {
  try {
    if (!req.body.idFactura || !req.body.idProducto || req.body.cantidad == null || req.body.precioUnitario == null || !req.body.tipo) {
      return res.status(400).send({ message: "idFactura, idProducto, cantidad, precioUnitario y tipo son obligatorios." });
    }
    const data = await LineaFactura.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando LineaFactura." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await LineaFactura.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando LineasFactura." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { idFactura, idProducto } = req.params;
    const data = await LineaFactura.findOne({ where: { idFactura, idProducto } });
    if (!data) return res.status(404).send({ message: "LineaFactura no encontrada." });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo LineaFactura." });
  }
};

exports.update = async (req, res) => {
  try {
    const { idFactura, idProducto } = req.params;
    const [num] = await LineaFactura.update(req.body, { where: { idFactura, idProducto } });
    if (num === 1) return res.send({ message: "LineaFactura actualizada correctamente." });
    return res.send({ message: "No ha sido posible actualizar LineaFactura." });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando LineaFactura." });
  }
};

exports.delete = async (req, res) => {
  try {
    const { idFactura, idProducto } = req.params;
    const num = await LineaFactura.destroy({ where: { idFactura, idProducto } });
    if (num === 1) return res.send({ message: "LineaFactura eliminada correctamente." });
    return res.send({ message: "No ha sido posible eliminar LineaFactura." });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando LineaFactura." });
  }
};
