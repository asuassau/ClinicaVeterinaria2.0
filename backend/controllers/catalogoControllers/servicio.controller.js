const db = require("../../models");
const Servicio = db.Servicio;

exports.create = async (req, res) => {
  try {
    if (!req.body.idElemento || !req.body.tipoServicio) {
      return res.status(400).send({ message: "idElemento y tipoServicio son obligatorios." });
    }
    const data = await Servicio.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Servicio." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Servicio.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Servicios." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Servicio.findByPk(id);
    if (!data) return res.status(404).send({ message: `Servicio no encontrado idElemento=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Servicio." });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [num] = await Servicio.update(req.body, { where: { idElemento: id } });
    if (num === 1) return res.send({ message: "Servicio actualizado correctamente." });
    return res.send({ message: `No ha sido posible actualizar Servicio idElemento=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando Servicio id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Servicio.destroy({ where: { idElemento: id } });
    if (num === 1) return res.send({ message: "Servicio eliminado correctamente." });
    return res.send({ message: `No ha sido posible eliminar Servicio idElemento=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Servicio id=" + req.params.id });
  }
};
