const db = require("../../models");
const Elemento = db.Elemento;
const Producto = db.Producto;

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
    if (!req.body.nombre || req.body.precio === undefined || !req.body.tipo ||
        req.body.stock === undefined || req.body.stockMinimo === undefined) {
      await t.rollback();
      return res.status(400).send({
        message: "nombre, precio, stock, stockMinimo y tipo son obligatorios."
      });
    }

    const elemento = await Elemento.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio
    }, { transaction: t });

    const producto = await Producto.create({
      idElemento: elemento.idElemento,
      stock: req.body.stock,
      stockMinimo: req.body.stockMinimo,
      tipo: req.body.tipo,
      foto: req.body.foto
    }, { transaction: t });

    await t.commit();

    const data = await Producto.findByPk(producto.idElemento, {
      include: [{ model: Elemento, as: "Elemento" }]
    });

    return res.send(data);
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: err.message || "Error creando Producto." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Producto.findAll({
      include: [{ model: Elemento, as: "Elemento" }]
    });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Productos." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Producto.findByPk(id, {
      include: [{ model: Elemento, as: "Elemento" }]
    });
    if (!data) return res.status(404).send({ message: `Producto no encontrado idElemento=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Producto." });
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

    const productoData = pickDefined({
      stock: req.body.stock,
      stockMinimo: req.body.stockMinimo,
      tipo: req.body.tipo,
      foto: req.body.foto
    });

    // Actualiza Elemento si vienen campos
    if (Object.keys(elementoData).length > 0) {
      await Elemento.update(elementoData, { where: { idElemento: id }, transaction: t });
    }

    // Actualiza Producto si vienen campos
    let updatedProducto = 0;
    if (Object.keys(productoData).length > 0) {
      const [num] = await Producto.update(productoData, { where: { idElemento: id }, transaction: t });
      updatedProducto = num;
    } else {
      // Si no viene nada de Producto, comprobamos que exista
      const exists = await Producto.findByPk(id, { transaction: t });
      updatedProducto = exists ? 1 : 0;
    }

    await t.commit();

    if (updatedProducto !== 1) {
      return res.send({ message: `No ha sido posible actualizar Producto idElemento=${id}.` });
    }

    const data = await Producto.findByPk(id, {
      include: [{ model: Elemento, as: "Elemento" }]
    });

    return res.send(data);
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: "Error actualizando Producto id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const id = req.params.id;

    const num = await Producto.destroy({ where: { idElemento: id }, transaction: t });

    // Si se borra el producto, se borra también el elemento asociado
    if (num === 1) {
      await Elemento.destroy({ where: { idElemento: id }, transaction: t });
    }

    await t.commit();

    if (num === 1) return res.send({ message: "Producto eliminado correctamente." });
    return res.send({ message: `No ha sido posible eliminar Producto idElemento=${id}.` });
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: "Error eliminando Producto id=" + req.params.id });
  }
};
