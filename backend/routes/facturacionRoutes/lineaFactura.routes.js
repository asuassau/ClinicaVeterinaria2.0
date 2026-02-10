//Rutas de lineas de factura

module.exports = app => {
  const lineasFactura = require("../../controllers/facturacionControllers/lineaFactura.controller.js");
  const auth = require("../../controllers/baseControllers/auth.js");

  var router = require("express").Router();

  // Crea una nueva linea de factura
  router.post("/", auth.isAuthenticated, lineasFactura.create);

  // Muestra todas las lineas de factura
  router.get("/", auth.isAuthenticated, lineasFactura.findAll);

  // Localiza una linea de factura por la id
  router.get("/:id", auth.isAuthenticated, lineasFactura.findOne);

  // Actualiza una linea de factura por la id
  router.put("/:id", auth.isAuthenticated, lineasFactura.update);

  // Borra una linea de factura por la id
  router.delete("/:id", auth.isAuthenticated, lineasFactura.delete);

  app.use('/api/lineaFactura', router);
};
