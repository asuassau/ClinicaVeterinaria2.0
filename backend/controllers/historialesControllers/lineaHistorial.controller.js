const db = require("../../models");
const LineaHistorial = db.LineaHistorial;

exports.create = async (req, res) => {
  try {
    if (!req.body.fechaCreacion || !req.body.tipo || !req.body.descripcion || !req.body.idHistorial || !req.body.idUsuario) {
      return res.status(400).send({ message: "fechaCreacion, tipo, descripcion, idHistorial e idUsuario son obligatorios." });
    }
    const data = await LineaHistorial.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando LineaHistorial." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await LineaHistorial.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando LineasHistorial." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await LineaHistorial.findByPk(id);
    if (!data) return res.status(404).send({ message: `LineaHistorial no encontrada id=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo LineaHistorial." });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [num] = await LineaHistorial.update(req.body, { where: { idLineaHistorial: id } });
    if (num === 1) return res.send({ message: "LineaHistorial actualizada correctamente." });
    return res.send({ message: `No ha sido posible actualizar LineaHistorial id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando LineaHistorial id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await LineaHistorial.destroy({ where: { idLineaHistorial: id } });
    if (num === 1) return res.send({ message: "LineaHistorial eliminada correctamente." });
    return res.send({ message: `No ha sido posible eliminar LineaHistorial id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando LineaHistorial id=" + req.params.id });
  }
};
