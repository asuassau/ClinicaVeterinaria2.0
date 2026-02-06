const db = require("../models");
const ServicioClinico = db.servicioClinico;

exports.create = async (req, res) => {
  try {
    if (!req.body.nombre || req.body.precio == null || !req.body.tipoServicio) {
      return res.status(400).send({ message: "nombre, precio y tipoServicio son obligatorios." });
    }
    const data = await ServicioClinico.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando ServicioClinico." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await ServicioClinico.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando ServicioClinico." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ServicioClinico.findByPk(id);
    if (!data) return res.status(404).send({ message: `ServicioClinico no encontrado id=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo ServicioClinico." });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [num] = await ServicioClinico.update(req.body, { where: { idServicio: id } });
    if (num === 1) return res.send({ message: "ServicioClinico actualizado correctamente." });
    return res.send({ message: `No ha sido posible actualizar ServicioClinico id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando ServicioClinico id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await ServicioClinico.destroy({ where: { idServicio: id } });
    if (num === 1) return res.send({ message: "ServicioClinico eliminado correctamente." });
    return res.send({ message: `No ha sido posible eliminar ServicioClinico id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando ServicioClinico id=" + req.params.id });
  }
};
