//Rutas de citas

module.exports = app => {
  const citas = require("../../controllers/citasControllers/cita.controller.js");
  const auth = require("../../controllers/baseControllers/auth.js");

  var router = require("express").Router();

  // Crea una nueva cita
  router.post("/", auth.isAuthenticated, citas.create);

  // Muestra todas las citas
  router.get("/", auth.isAuthenticated, citas.findAll);

  // Localiza una cita por la id
  router.get("/:id", auth.isAuthenticated, citas.findOne);

  // Actualiza una cita por la id
  router.put("/:id", auth.isAuthenticated, citas.update);

  // Borra una cita por la id
  router.delete("/:id", auth.isAuthenticated, citas.delete);

  app.use('/api/cita', router);
};
