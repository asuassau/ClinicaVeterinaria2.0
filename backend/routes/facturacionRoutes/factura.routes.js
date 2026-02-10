//Rutas de facturas

module.exports = app => {
  const facturas = require("../../controllers/facturacionControllers/factura.controller.js");
  const auth = require("../../controllers/baseControllers/auth.js");

  var router = require("express").Router();

  // Crea una nueva factura
  router.post("/", auth.isAuthenticated, facturas.create);

  // Muestra todas las facturas
  router.get("/", auth.isAuthenticated, facturas.findAll);

  // Localiza una factura por la id
  router.get("/:id", auth.isAuthenticated, facturas.findOne);

  // Actualiza una factura por la id
  router.put("/:id", auth.isAuthenticated, facturas.update);

  // Borra una factura por la id
  router.delete("/:id", auth.isAuthenticated, facturas.delete);

  app.use('/api/factura', router);
};
