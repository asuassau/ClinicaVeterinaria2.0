const db = require("../../models");
const Factura = db.Factura;
const LineaFactura = db.LineaFactura;

exports.create = async (req, res) => {
  try {
    if (!req.body.fechaCreacion || !req.body.estado || !req.body.n_factura ||
        !req.body.idUsuario_pagador || !req.body.idUsuario_emisor) {
      return res.status(400).send({
        message: "fechaCreacion, estado, n_factura, idUsuario_pagador e idUsuario_emisor son obligatorios."
      });
    }

    // total lo calcula backend (empieza en 0)
    const data = await Factura.create({
      ...req.body,
      total: 0
    });

    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Factura." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const include = req.query.include === '1';
    const data = await Factura.findAll({
      include: include ? [
        { model: db.Usuario, as: "Pagador" },
        { model: db.Usuario, as: "Emisor" },
        { model: db.LineaFactura, as: "Lineas", include: [{ model: db.Elemento, as: "Elemento" }] }
      ] : []
    });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Facturas." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const include = req.query.include === '1';

    const data = await Factura.findByPk(id, {
      include: include ? [
        { model: db.Usuario, as: "Pagador" },
        { model: db.Usuario, as: "Emisor" },
        { model: db.LineaFactura, as: "Lineas", include: [{ model: db.Elemento, as: "Elemento" }] }
      ] : []
    });

    if (!data) return res.status(404).send({ message: `Factura no encontrada id=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Factura." });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    // OJO: idealmente NO permitir actualizar total desde fuera
    if ('total' in req.body) delete req.body.total;

    const [num] = await Factura.update(req.body, { where: { idFactura: id } });
    if (num === 1) return res.send({ message: "Factura actualizada correctamente." });
    return res.send({ message: `No ha sido posible actualizar Factura id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando Factura id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const id = req.params.id;

    // Borra líneas primero (si no tienes FK cascade real)
    await LineaFactura.destroy({ where: { idFactura: id }, transaction: t });

    const num = await Factura.destroy({ where: { idFactura: id }, transaction: t });

    await t.commit();

    if (num === 1) return res.send({ message: "Factura eliminada correctamente (y sus líneas)." });
    return res.send({ message: `No ha sido posible eliminar Factura id=${id}.` });
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: "Error eliminando Factura id=" + req.params.id });
  }
};
