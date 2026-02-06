const db = require("../models");
const Producto = db.producto;

exports.create = async (req, res) => {
  try {
    if (!req.body.nombre || req.body.stock == null || req.body.stockMinimo == null || !req.body.tipo) {
      return res.status(400).send({ message: "nombre, stock, stockMinimo y tipo son obligatorios." });
    }
    const data = await Producto.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Producto." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Producto.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Productos." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Producto.findByPk(id);
    if (!data) return res.status(404).send({ message: `Producto no encontrado id=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Producto." });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [num] = await Producto.update(req.body, { where: { idProducto: id } });
    if (num === 1) return res.send({ message: "Producto actualizado correctamente." });
    return res.send({ message: `No ha sido posible actualizar Producto id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando Producto id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Producto.destroy({ where: { idProducto: id } });
    if (num === 1) return res.send({ message: "Producto eliminado correctamente." });
    return res.send({ message: `No ha sido posible eliminar Producto id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Producto id=" + req.params.id });
  }
};
