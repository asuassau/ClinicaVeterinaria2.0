//Rutas de historiales

module.exports = app => {
  const historiales = require("../../controllers/historialesControllers/historial.controller.js");
  const auth = require("../../controllers/baseControllers/auth.js");

  var router = require("express").Router();

  // Crea un nuevo historial
  router.post("/", auth.isAuthenticated, historiales.create);

  // Muestra todos los historiales
  router.get("/", auth.isAuthenticated, historiales.findAll);

  // Localiza un historial por la id
  router.get("/:id", auth.isAuthenticated, historiales.findOne);

  // Actualiza un historial por la id
  router.put("/:id", auth.isAuthenticated, historiales.update);

  // Borra un historial por la id
  router.delete("/:id", auth.isAuthenticated, historiales.delete);

  app.use('/api/historial', router);
};
