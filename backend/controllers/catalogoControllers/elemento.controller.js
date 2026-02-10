const db = require("../../models");
const Elemento = db.Elemento;

exports.create = async (req, res) => {
  try {
    if (!req.body.nombre || req.body.precio === undefined) {
      return res.status(400).send({ message: "nombre y precio son obligatorios." });
    }
    const data = await Elemento.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Elemento." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Elemento.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Elementos." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Elemento.findByPk(id);
    if (!data) return res.status(404).send({ message: `Elemento no encontrado id=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Elemento." });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [num] = await Elemento.update(req.body, { where: { idElemento: id } });
    if (num === 1) return res.send({ message: "Elemento actualizado correctamente." });
    return res.send({ message: `No ha sido posible actualizar Elemento id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando Elemento id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Elemento.destroy({ where: { idElemento: id } });
    if (num === 1) return res.send({ message: "Elemento eliminado correctamente." });
    return res.send({ message: `No ha sido posible eliminar Elemento id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Elemento id=" + req.params.id });
  }
};
