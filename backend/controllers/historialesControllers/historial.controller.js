const db = require("../../models");
const Historial = db.Historial;
const LineaHistorial = db.LineaHistorial;

exports.create = async (req, res) => {
  try {
    if (!req.body.fechaAlta || !req.body.estado || !req.body.idAnimal) {
      return res.status(400).send({ message: "fechaAlta, estado e idAnimal son obligatorios." });
    }
    const data = await Historial.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Historial." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Historial.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Historiales." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Historial.findByPk(id);
    if (!data) return res.status(404).send({ message: `Historial no encontrado id=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Historial." });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [num] = await Historial.update(req.body, { where: { idHistorial: id } });
    if (num === 1) return res.send({ message: "Historial actualizado correctamente." });
    return res.send({ message: `No ha sido posible actualizar Historial id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando Historial id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const id = req.params.id;

    // 1) Borra líneas primero (si no tienes FK cascade real)
    await LineaHistorial.destroy({ where: { idHistorial: id }, transaction: t });

    // 2) Borra historial
    const num = await Historial.destroy({ where: { idHistorial: id }, transaction: t });

    await t.commit();

    if (num === 1) return res.send({ message: "Historial eliminado correctamente (y sus líneas)." });
    return res.send({ message: `No ha sido posible eliminar Historial id=${id}.` });

  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: "Error eliminando Historial id=" + req.params.id });
  }
};
