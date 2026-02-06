const db = require("../models");
const Cliente = db.cliente;

exports.create = async (req, res) => {
  try {
    if (!req.body.nif || !req.body.nombre || !req.body.apellidos) {
      return res.status(400).send({ message: "nif, nombre y apellidos son obligatorios." });
    }
    const data = await Cliente.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Cliente." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Cliente.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Clientes." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Cliente.findByPk(id);
    if (!data) return res.status(404).send({ message: `Cliente no encontrado id=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Cliente." });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [num] = await Cliente.update(req.body, { where: { idCliente: id } });
    if (num === 1) return res.send({ message: "Cliente actualizado correctamente." });
    return res.send({ message: `No ha sido posible actualizar Cliente id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando Cliente id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Cliente.destroy({ where: { idCliente: id } });
    if (num === 1) return res.send({ message: "Cliente eliminado correctamente." });
    return res.send({ message: `No ha sido posible eliminar Cliente id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Cliente id=" + req.params.id });
  }
};
