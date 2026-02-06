const db = require("../models");
const Factura = db.factura;

exports.create = async (req, res) => {
  try {
    if (!req.body.fecha || req.body.total == null || !req.body.idCita) {
      return res.status(400).send({ message: "fecha, total e idCita son obligatorios." });
    }
    const data = await Factura.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Factura." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Factura.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Facturas." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Factura.findByPk(id);
    if (!data) return res.status(404).send({ message: `Factura no encontrada id=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Factura." });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [num] = await Factura.update(req.body, { where: { idFactura: id } });
    if (num === 1) return res.send({ message: "Factura actualizada correctamente." });
    return res.send({ message: `No ha sido posible actualizar Factura id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando Factura id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Factura.destroy({ where: { idFactura: id } });
    if (num === 1) return res.send({ message: "Factura eliminada correctamente." });
    return res.send({ message: `No ha sido posible eliminar Factura id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Factura id=" + req.params.id });
  }
};
