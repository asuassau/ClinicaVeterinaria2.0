const db = require("../../models");
const LineaFactura = db.LineaFactura;
const Factura = db.Factura;
const Producto = db.Producto;
const Elemento = db.Elemento;

function toNumber(x, def = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : def;
}

function calcImporte({ cantidad, precioUnitario, descuento }) {
  const c = toNumber(cantidad, 0);
  const p = toNumber(precioUnitario, 0);
  const d = toNumber(descuento, 0);
  const imp = (c * p) - d;
  return Math.max(0, Number(imp.toFixed(2)));
}

/**
 * Si idElemento es Producto => ajusta stock.
 * deltaQty > 0  => devolver stock (sumar)
 * deltaQty < 0  => descontar stock (restar)
 */
async function ajustarStockSiProducto(idElemento, deltaQty, transaction) {
  if (!deltaQty) return;

  const producto = await Producto.findByPk(idElemento, { transaction });
  if (!producto) return; // no es producto => no se toca stock

  const actual = toNumber(producto.stock, 0);
  const nuevo = actual + toNumber(deltaQty, 0);

  if (nuevo < 0) {
    throw new Error(`Stock insuficiente para el producto (idElemento=${idElemento}). Stock actual=${actual}, cambio=${deltaQty}`);
  }

  await Producto.update(
    { stock: nuevo },
    { where: { idElemento }, transaction }
  );
}

async function recalcularTotalFactura(idFactura, transaction) {
  // subtotal = suma importes líneas
  const lineas = await LineaFactura.findAll({
    where: { idFactura },
    attributes: ['importe'],
    transaction
  });

  const subtotal = lineas.reduce((acc, l) => acc + toNumber(l.importe, 0), 0);

  const factura = await Factura.findByPk(idFactura, { transaction });
  if (!factura) throw new Error(`Factura no encontrada para recalcular total (idFactura=${idFactura})`);

  const descPct = toNumber(factura.descPct, 0);
  const impuestoPct = toNumber(factura.impuestoPct, 0);

  // Regla típica: aplicar descuento % al subtotal, luego impuesto %
  const trasDesc = subtotal * (1 - (descPct / 100));
  const total = trasDesc * (1 + (impuestoPct / 100));

  await Factura.update(
    { total: Number(total.toFixed(2)) },
    { where: { idFactura }, transaction }
  );
}

/**
 * GET /api/lineaFactura
 * - ?facturaId=123 => filtra por factura
 * - ?include=1 => incluye Elemento y Creador
 */
exports.findAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.facturaId) where.idFactura = req.query.facturaId;

    const include = req.query.include === '1';

    const data = await LineaFactura.findAll({
      where,
      include: include ? [
        { model: Elemento, as: "Elemento" },
        { model: db.Usuario, as: "Creador" }
      ] : []
    });

    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando LineasFactura." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const include = req.query.include === '1';

    const data = await LineaFactura.findByPk(id, {
      include: include ? [
        { model: Elemento, as: "Elemento" },
        { model: db.Usuario, as: "Creador" }
      ] : []
    });

    if (!data) return res.status(404).send({ message: `LineaFactura no encontrada id=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo LineaFactura." });
  }
};

exports.create = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    if (!req.body.fechaCreacion || req.body.cantidad === undefined || req.body.precioUnitario === undefined ||
        !req.body.idFactura || !req.body.idElemento || !req.body.idUsuario_creador) {
      await t.rollback();
      return res.status(400).send({
        message: "fechaCreacion, cantidad, precioUnitario, idFactura, idElemento e idUsuario_creador son obligatorios."
      });
    }

    const cantidad = toNumber(req.body.cantidad, 1);
    const precioUnitario = toNumber(req.body.precioUnitario, 0);
    const descuento = toNumber(req.body.descuento, 0);

    const importe = calcImporte({ cantidad, precioUnitario, descuento });

    // 1) Descontar stock si es producto
    // crear línea => consumo => deltaQty NEGATIVO
    await ajustarStockSiProducto(req.body.idElemento, -cantidad, t);

    // 2) Crear línea
    const data = await LineaFactura.create({
      ...req.body,
      cantidad,
      precioUnitario,
      descuento,
      importe
    }, { transaction: t });

    // 3) Recalcular total factura
    await recalcularTotalFactura(req.body.idFactura, t);

    await t.commit();
    return res.send(data);
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: err.message || "Error creando LineaFactura." });
  }
};

exports.update = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const id = req.params.id;

    const actual = await LineaFactura.findByPk(id, { transaction: t });
    if (!actual) {
      await t.rollback();
      return res.status(404).send({ message: `LineaFactura no encontrada id=${id}` });
    }

    const oldFactura = actual.idFactura;
    const oldElemento = actual.idElemento;
    const oldCantidad = toNumber(actual.cantidad, 0);

    // Nuevos valores (si no vienen, mantener)
    const newFactura = req.body.idFactura !== undefined ? Number(req.body.idFactura) : oldFactura;
    const newElemento = req.body.idElemento !== undefined ? Number(req.body.idElemento) : oldElemento;

    const newCantidad = req.body.cantidad !== undefined ? toNumber(req.body.cantidad, oldCantidad) : oldCantidad;
    const newPrecioUnitario = req.body.precioUnitario !== undefined ? toNumber(req.body.precioUnitario, actual.precioUnitario) : toNumber(actual.precioUnitario, 0);
    const newDescuento = req.body.descuento !== undefined ? toNumber(req.body.descuento, actual.descuento) : toNumber(actual.descuento, 0);

    // 1) Ajuste stock:
    // - Si cambia elemento: devolver stock del viejo y descontar del nuevo
    // - Si mismo elemento: ajustar por delta cantidad
    if (newElemento !== oldElemento) {
      // devolver lo consumido del viejo
      await ajustarStockSiProducto(oldElemento, +oldCantidad, t);
      // consumir del nuevo
      await ajustarStockSiProducto(newElemento, -newCantidad, t);
    } else {
      const delta = newCantidad - oldCantidad; // si aumenta cantidad => consumir más
      if (delta !== 0) {
        await ajustarStockSiProducto(oldElemento, -delta, t);
      }
    }

    // 2) Recalcular importe y actualizar
    const newImporte = calcImporte({ cantidad: newCantidad, precioUnitario: newPrecioUnitario, descuento: newDescuento });

    await LineaFactura.update({
      ...req.body,
      cantidad: newCantidad,
      precioUnitario: newPrecioUnitario,
      descuento: newDescuento,
      importe: newImporte,
      idFactura: newFactura,
      idElemento: newElemento
    }, { where: { idLineaFactura: id }, transaction: t });

    // 3) Recalcular factura(s)
    // si cambió idFactura, recalcular ambas
    await recalcularTotalFactura(oldFactura, t);
    if (newFactura !== oldFactura) await recalcularTotalFactura(newFactura, t);

    await t.commit();
    return res.send({ message: "LineaFactura actualizada correctamente." });
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: err.message || "Error actualizando LineaFactura id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const id = req.params.id;

    const lf = await LineaFactura.findByPk(id, { transaction: t });
    if (!lf) {
      await t.rollback();
      return res.status(404).send({ message: `LineaFactura no encontrada id=${id}` });
    }

    const idFactura = lf.idFactura;
    const idElemento = lf.idElemento;
    const cantidad = toNumber(lf.cantidad, 0);

    // 1) Devolver stock si es producto
    await ajustarStockSiProducto(idElemento, +cantidad, t);

    // 2) Borrar línea
    const num = await LineaFactura.destroy({ where: { idLineaFactura: id }, transaction: t });

    // 3) Recalcular total factura
    await recalcularTotalFactura(idFactura, t);

    await t.commit();

    if (num === 1) return res.send({ message: "LineaFactura eliminada correctamente." });
    return res.send({ message: `No ha sido posible eliminar LineaFactura id=${id}.` });
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: err.message || "Error eliminando LineaFactura id=" + req.params.id });
  }
};
