const db = require("../../models");
const Animal = db.Animal;

exports.create = async (req, res) => {
  try {
    if (!req.body.nombre || !req.body.idUsuario) {
      return res.status(400).send({ message: "nombre e idUsuario son obligatorios." });
    }
    if (req.file) {
      req.body.foto = req.file.filename;
    } else {
      req.body.foto = "";
    }

    const data = await Animal.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Animal." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Animal.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Animales." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Animal.findByPk(id);
    if (!data) return res.status(404).send({ message: `Animal no encontrado id=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Animal." });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

      const removeImage =
    req.body.removeImage === true ||
    req.body.removeImage === 'true' ||
    req.body.removeImage === '1' ||
    req.body.removeImage === 1;
    if (req.file) {
      req.body.foto = req.file.filename;
    } 
    if (removeImage) {
      req.body.foto = null;
  }
    const [num] = await Animal.update(req.body, { where: { idAnimal: id } });
    if (num === 1) return res.send({ message: "Animal actualizado correctamente." });
    return res.send({ message: `No ha sido posible actualizar Animal id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando Animal id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Animal.destroy({ where: { idAnimal: id } });
    if (num === 1) return res.send({ message: "Animal eliminado correctamente." });
    return res.send({ message: `No ha sido posible eliminar Animal id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Animal id=" + req.params.id });
  }
};
