const db = require("../../models");
const Elemento = db.Elemento;
const Servicio = db.Servicio;

function pickDefined(obj) {
  const out = {};
  Object.keys(obj).forEach((k) => {
    if (obj[k] !== undefined) out[k] = obj[k];
  });
  return out;
}

exports.create = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    if (!req.body.nombre || req.body.precio === undefined || !req.body.tipoServicio) {
      await t.rollback();
      return res.status(400).send({
        message: "nombre, precio y tipoServicio son obligatorios."
      });
    }

    const elemento = await Elemento.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio
    }, { transaction: t });

    const servicio = await Servicio.create({
      idElemento: elemento.idElemento,
      tipoServicio: req.body.tipoServicio
    }, { transaction: t });

    await t.commit();

    const data = await Servicio.findByPk(servicio.idElemento, {
      include: [{ model: Elemento, as: "Elemento" }]
    });

    return res.send(data);
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: err.message || "Error creando Servicio." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Servicio.findAll({
      include: [{ model: Elemento, as: "Elemento" }]
    });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Servicios." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Servicio.findByPk(id, {
      include: [{ model: Elemento, as: "Elemento" }]
    });
    if (!data) return res.status(404).send({ message: `Servicio no encontrado idElemento=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Servicio." });
  }
};

exports.update = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const id = req.params.id;

    const elementoData = pickDefined({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio
    });

    const servicioData = pickDefined({
      tipoServicio: req.body.tipoServicio
    });

    if (Object.keys(elementoData).length > 0) {
      await Elemento.update(elementoData, { where: { idElemento: id }, transaction: t });
    }

    let updatedServicio = 0;
    if (Object.keys(servicioData).length > 0) {
      const [num] = await Servicio.update(servicioData, { where: { idElemento: id }, transaction: t });
      updatedServicio = num;
    } else {
      const exists = await Servicio.findByPk(id, { transaction: t });
      updatedServicio = exists ? 1 : 0;
    }

    await t.commit();

    if (updatedServicio !== 1) {
      return res.send({ message: `No ha sido posible actualizar Servicio idElemento=${id}.` });
    }

    const data = await Servicio.findByPk(id, {
      include: [{ model: Elemento, as: "Elemento" }]
    });

    return res.send(data);
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: "Error actualizando Servicio id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const id = req.params.id;

    const num = await Servicio.destroy({ where: { idElemento: id }, transaction: t });

    if (num === 1) {
      await Elemento.destroy({ where: { idElemento: id }, transaction: t });
    }

    await t.commit();

    if (num === 1) return res.send({ message: "Servicio eliminado correctamente." });
    return res.send({ message: `No ha sido posible eliminar Servicio idElemento=${id}.` });
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: "Error eliminando Servicio id=" + req.params.id });
  }
};
