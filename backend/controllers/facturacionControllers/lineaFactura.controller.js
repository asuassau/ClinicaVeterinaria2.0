const db = require("../../models");
const LineaFactura = db.LineaFactura;

exports.create = async (req, res) => {
  try {
    if (!req.body.fechaCreacion || req.body.cantidad === undefined || req.body.precioUnitario === undefined ||
        !req.body.idFactura || !req.body.idElemento || !req.body.idUsuario_creador) {
      return res.status(400).send({
        message: "fechaCreacion, cantidad, precioUnitario, idFactura, idElemento e idUsuario_creador son obligatorios."
      });
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
    const id = req.params.id;
    const data = await LineaFactura.findByPk(id);
    if (!data) return res.status(404).send({ message: `LineaFactura no encontrada id=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo LineaFactura." });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [num] = await LineaFactura.update(req.body, { where: { idLineaFactura: id } });
    if (num === 1) return res.send({ message: "LineaFactura actualizada correctamente." });
    return res.send({ message: `No ha sido posible actualizar LineaFactura id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando LineaFactura id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await LineaFactura.destroy({ where: { idLineaFactura: id } });
    if (num === 1) return res.send({ message: "LineaFactura eliminada correctamente." });
    return res.send({ message: `No ha sido posible eliminar LineaFactura id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando LineaFactura id=" + req.params.id });
  }
};
