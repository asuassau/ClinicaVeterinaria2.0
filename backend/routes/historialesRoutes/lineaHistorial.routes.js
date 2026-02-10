//Rutas de lineas de historial

module.exports = app => {
  const lineasHistorial = require("../../controllers/historialesControllers/lineaHistorial.controller.js");
  const auth = require("../../controllers/baseControllers/auth.js");

  var router = require("express").Router();

  // Crea una nueva linea de historial
  router.post("/", auth.isAuthenticated, lineasHistorial.create);

  // Muestra todas las lineas de historial
  router.get("/", auth.isAuthenticated, lineasHistorial.findAll);

  // Localiza una linea de historial por la id
  router.get("/:id", auth.isAuthenticated, lineasHistorial.findOne);

  // Actualiza una linea de historial por la id
  router.put("/:id", auth.isAuthenticated, lineasHistorial.update);

  // Borra una linea de historial por la id
  router.delete("/:id", auth.isAuthenticated, lineasHistorial.delete);

  app.use('/api/lineaHistorial', router);
};
