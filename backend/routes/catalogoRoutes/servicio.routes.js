//Rutas de servicios

module.exports = app => {
  const servicios = require("../../controllers/catalogoControllers/servicio.controller.js");
  const auth = require("../../controllers/baseControllers/auth.js");

  var router = require("express").Router();

  // Crea un nuevo servicio
  router.post("/", auth.isAuthenticated, servicios.create);

  // Muestra todos los servicios
  router.get("/", auth.isAuthenticated, servicios.findAll);

  // Localiza un servicio por la id (idElemento)
  router.get("/:id", auth.isAuthenticated, servicios.findOne);

  // Actualiza un servicio por la id (idElemento)
  router.put("/:id", auth.isAuthenticated, servicios.update);

  // Borra un servicio por la id (idElemento)
  router.delete("/:id", auth.isAuthenticated, servicios.delete);

  app.use('/api/servicio', router);
};
